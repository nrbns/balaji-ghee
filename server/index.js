const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { initDatabase, promisify } = require('./database');
const authMiddleware = require('./middleware/auth');
const rateLimitMiddleware = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
const db = initDatabase();
const dbAsync = promisify(db);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// ==================== AUTH ROUTES ====================

// Register admin (only first user can be MASTER)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if users exist
    const existingUsers = await dbAsync.all('SELECT COUNT(*) as count FROM users');
    if (existingUsers.length > 0 && role === 'MASTER') {
      return res.status(403).json({ error: 'MASTER role can only be assigned to first user' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert user
    await dbAsync.run(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, role || 'STAFF']
    );

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Login
app.post('/api/auth/login', rateLimitMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await dbAsync.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await dbAsync.get('SELECT id, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HOMEPAGE ROUTES ====================

// Get current published homepage
app.get('/api/homepage/current', async (req, res) => {
  try {
    const siteState = await dbAsync.get('SELECT homepage_version_id FROM site_state WHERE id = 1');
    if (!siteState || !siteState.homepage_version_id) {
      return res.json(null);
    }
    const version = await dbAsync.get('SELECT * FROM homepage_versions WHERE id = ?', [siteState.homepage_version_id]);
    res.json(version ? JSON.parse(version.data) : null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create draft from current
app.post('/api/homepage/draft', authMiddleware, async (req, res) => {
  try {
    // Get current version to base draft on
    const siteState = await dbAsync.get('SELECT homepage_version_id FROM site_state WHERE id = 1');
    let data = {};

    if (siteState && siteState.homepage_version_id) {
      const current = await dbAsync.get('SELECT data FROM homepage_versions WHERE id = ?', [siteState.homepage_version_id]);
      if (current) {
        data = JSON.parse(current.data);
      }
    }

    // Create new draft version
    const result = await dbAsync.run(
      'INSERT INTO homepage_versions (version, status, data, created_by) VALUES (?, ?, ?, ?)',
      [1, 'draft', JSON.stringify(data), req.user.id]
    );

    res.json({ id: result.id, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update draft
app.put('/api/homepage/draft/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    await dbAsync.run(
      'UPDATE homepage_versions SET data = ? WHERE id = ? AND status = ?',
      [JSON.stringify(data), id, 'draft']
    );

    res.json({ message: 'Draft updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish homepage version
app.post('/api/homepage/:id/publish', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is MASTER
    const user = await dbAsync.get('SELECT role FROM users WHERE id = ?', [req.user.id]);
    if (user.role !== 'MASTER') {
      return res.status(403).json({ error: 'Only MASTER can publish' });
    }

    // Update status to published
    await dbAsync.run('UPDATE homepage_versions SET status = ? WHERE id = ?', ['published', id]);

    // Update site_state pointer
    await dbAsync.run('UPDATE site_state SET homepage_version_id = ? WHERE id = 1', [id]);

    // Log action
    await dbAsync.run(
      'INSERT INTO audit_logs (user_id, action, entity, entity_id) VALUES (?, ?, ?, ?)',
      [req.user.id, 'publish_homepage', 'homepage_version', id]
    );

    res.json({ message: 'Published successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== LEADS ROUTES ====================

// Create lead (public)
app.post('/api/leads', rateLimitMiddleware, async (req, res) => {
  try {
    const { full_name, email, phone, source, utm, message } = req.body;

    const result = await dbAsync.run(
      `INSERT INTO leads (full_name, email, phone, source, utm, message, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, phone, source || 'contact_form', JSON.stringify(utm || {}), message, 'new']
    );

    res.json({ id: result.id, message: 'Lead created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leads (with filters)
app.get('/api/leads', authMiddleware, async (req, res) => {
  try {
    const { status, q, startDate, endDate, page = 1, limit = 25 } = req.query;
    let sql = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (q) {
      sql += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const search = `%${q}%`;
      params.push(search, search, search);
    }
    if (startDate) {
      sql += ' AND created_at >= ?';
      params.push(startDate);
    }
    if (endDate) {
      sql += ' AND created_at <= ?';
      params.push(endDate);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const leads = await dbAsync.all(sql, params);
    leads.forEach(lead => {
      if (lead.utm) lead.utm = JSON.parse(lead.utm);
      if (lead.tags) lead.tags = JSON.parse(lead.tags);
    });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single lead
app.get('/api/leads/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await dbAsync.get('SELECT * FROM leads WHERE id = ?', [id]);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    if (lead.utm) lead.utm = JSON.parse(lead.utm);
    if (lead.tags) lead.tags = JSON.parse(lead.tags);

    // Get notes
    const notes = await dbAsync.all(
      `SELECT ln.*, u.email as user_email 
       FROM lead_notes ln 
       LEFT JOIN users u ON ln.user_id = u.id 
       WHERE ln.lead_id = ? 
       ORDER BY ln.created_at DESC`,
      [id]
    );

    res.json({ ...lead, notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lead
app.put('/api/leads/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tags } = req.body;

    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (tags) {
      updates.push('tags = ?');
      params.push(JSON.stringify(tags));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await dbAsync.run(
      `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Log action
    await dbAsync.run(
      'INSERT INTO audit_logs (user_id, action, entity, entity_id) VALUES (?, ?, ?, ?)',
      [req.user.id, 'update_lead', 'lead', id]
    );

    res.json({ message: 'Lead updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add note to lead
app.post('/api/leads/:id/notes', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const result = await dbAsync.run(
      'INSERT INTO lead_notes (lead_id, user_id, note) VALUES (?, ?, ?)',
      [id, req.user.id, note]
    );

    res.json({ id: result.id, message: 'Note added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export leads to CSV
app.get('/api/leads/export.csv', authMiddleware, async (req, res) => {
  try {
    const leads = await dbAsync.all('SELECT * FROM leads ORDER BY created_at DESC');
    
    const csv = [
      ['ID', 'Name', 'Email', 'Phone', 'Source', 'Status', 'Created At'].join(','),
      ...leads.map(lead => [
        lead.id,
        `"${lead.full_name || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.phone || ''}"`,
        `"${lead.source || ''}"`,
        lead.status,
        lead.created_at
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ANALYTICS ROUTES ====================

app.get('/api/analytics/leads-summary', authMiddleware, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    // Leads by day
    const byDay = await dbAsync.all(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM leads 
       WHERE created_at >= datetime('now', '-' || ? || ' days') 
       GROUP BY DATE(created_at) 
       ORDER BY date DESC`,
      [days]
    );

    // Leads by source
    const bySource = await dbAsync.all(
      `SELECT source, COUNT(*) as count 
       FROM leads 
       WHERE created_at >= datetime('now', '-' || ? || ' days') 
       GROUP BY source 
       ORDER BY count DESC`,
      [days]
    );

    // Leads by status
    const byStatus = await dbAsync.all(
      `SELECT status, COUNT(*) as count 
       FROM leads 
       GROUP BY status`
    );

    res.json({ byDay, bySource, byStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AUDIT LOG ROUTES ====================

app.get('/api/audit', authMiddleware, async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    const logs = await dbAsync.all(
      `SELECT a.*, u.email as user_email 
       FROM audit_logs a 
       LEFT JOIN users u ON a.user_id = u.id 
       ORDER BY a.created_at DESC 
       LIMIT ?`,
      [limit]
    );

    logs.forEach(log => {
      if (log.meta) log.meta = JSON.parse(log.meta);
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

