# Master Panel Setup Guide

## Quick Start (5 Minutes)

### 1. Install Dependencies

Open your terminal in the project root and run:
```bash
npm install
```

This will install all required packages including Express, SQLite, JWT, bcrypt, and other dependencies.

### 2. Create Environment File

Create a `.env` file in the root directory:
```bash
PORT=3001
JWT_SECRET=change-this-to-a-very-random-secret-minimum-32-characters
```

**Important:** Change the JWT_SECRET to a random string in production!

### 3. Create Master Admin Account

You have two options:

#### Option A: Using curl/Postman

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@balajighee.com",
    "password": "YourSecurePassword123!",
    "role": "MASTER"
  }'
```

#### Option B: Direct Database Insert (Advanced)

After running the server once, you can manually insert a user into the SQLite database.

### 4. Start the Application

In the project root, run:
```bash
npm run dev:full
```

This starts both:
- Frontend development server on http://localhost:3000
- Backend API server on http://localhost:3001

### 5. Access the Master Panel

1. Open http://localhost:3000 in your browser
2. Click the "Master Panel" button in the bottom-right corner
3. Login with the credentials you created
4. You're in! Start managing your store.

## Using the Master Panel

### Homepage Editor Tab

1. Click "Master Panel" → Homepage Editor tab
2. Edit the hero section:
   - Change title and subtitle
   - Update background image URL
   - See live preview
3. Manage products:
   - Add new products with "Add Product"
   - Edit existing products
   - Remove products (cannot remove all)
   - Preview images in real-time
4. Changes are saved immediately to browser context

### Leads Manager Tab

1. Click "Leads Manager" tab
2. View statistics dashboard:
   - Total leads by status
   - Recent activity
3. Search and filter:
   - Use search bar for name/email/phone
   - Filter by status
   - Click "Apply Filters"
4. Manage leads:
   - Update status dropdown
   - Export to CSV with "Export"
   - View lead details
5. Create a lead from your website:
   - Add a contact form that posts to `/api/leads`
   - See it appear in the panel immediately

## Creating Lead Capture Forms

### Simple Contact Form

Add this to your homepage HTML:

```html
<form id="contact-form" class="my-form">
  <input type="text" name="full_name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Email" required>
  <input type="tel" name="phone" placeholder="Phone">
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Send Message</button>
</form>

<script>
  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch('http://localhost:3001/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'contact_form' })
      });
      
      if (response.ok) {
        alert('Thank you! We\'ll contact you soon.');
        e.target.reset();
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
  });
</script>
```

### With UTM Tracking

```javascript
// Capture UTM parameters
const urlParams = new URLSearchParams(window.location.search);
const utm = {
  source: urlParams.get('utm_source'),
  medium: urlParams.get('utm_medium'),
  campaign: urlParams.get('utm_campaign'),
  term: urlParams.get('utm_term'),
  content: urlParams.get('utm_content')
};

// Include in lead submission
await fetch('http://localhost:3001/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...formData,
    source: 'website',
    utm: utm
  })
});
```

## User Roles

- **MASTER**: Full access to all features (only first user can be MASTER)
- **STAFF**: Can view leads and edit homepage, but cannot publish changes

## Database File

The SQLite database is stored at: `data/balaji_ghee.db`

You can inspect it using SQLite tools:
```bash
sqlite3 data/balaji_ghee.db
.tables
SELECT * FROM leads;
```

## Security Checklist

For production deployment:

- [ ] Change JWT_SECRET to a strong random string (32+ characters)
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL
- [ ] Implement proper CORS whitelist
- [ ] Set up database backups (daily recommended)
- [ ] Use a production database (PostgreSQL/MySQL instead of SQLite)
- [ ] Configure rate limiting per IP
- [ ] Add logging and monitoring
- [ ] Set up firewall rules
- [ ] Use a process manager (PM2)
- [ ] Configure reverse proxy (Nginx)

## Troubleshooting

### "Cannot find module" errors
Run `npm install` again

### Port already in use
Change `PORT` in `.env` and update `API_BASE` in `src/lib/api.ts`

### Login not working
- Ensure user exists in database
- Check JWT_SECRET matches in all services
- Clear browser localStorage: `localStorage.clear()`

### Database locked errors
- Stop all running servers
- Delete `data/balaji_ghee.db`
- Restart server to recreate database

### CORS errors
- Ensure backend is running on correct port
- Check `API_BASE` in `src/lib/api.ts` matches backend port

## API Documentation

Full API documentation is available in `README.md` under "API Endpoints" section.

## Need Help?

Refer to the main README.md for more details or contact support.

