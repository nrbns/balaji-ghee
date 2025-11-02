# Enhance Balaji Ghee Store UI

This is a code bundle for Enhance Balaji Ghee Store UI. The original project is available at https://www.figma.com/design/dA5N7O6HNKMGRHma3mCUJx/Enhance-Balaji-Ghee-Store-UI.

## Features

- Beautiful, modern UI with animations
- Master Admin Panel with secure login
- Homepage CMS for editing hero and products
- Leads Management System with analytics
- Real-time preview of changes
- SQLite database for data persistence
- JWT-based authentication

## Prerequisites

- Node.js 18+ and npm
- Windows/Linux/Mac

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
   ```

3. **Create data directory:**
   ```bash
   mkdir data
   ```

## Running the Application

### Development Mode (Recommended)
Run both frontend and backend together:
```bash
npm run dev:full
```

### Separate Modes
Run frontend only:
```bash
npm run dev
```

Run backend only:
```bash
npm run server
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## First-Time Setup

1. **Create a Master Admin account:**
   Use the registration endpoint or create directly in the database:
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"your-secure-password","role":"MASTER"}'
   ```

2. **Access the Master Panel:**
   - Click the **Login icon** 🔑 in the top-right navigation bar OR
   - Click the "Login to Master Panel" button in the bottom-right corner
   - Enter your credentials and click "Sign In"
   - Start editing the homepage or managing leads!

## Master Panel Features

### Homepage Editor
- Edit hero section (title, subtitle, background image)
- Add/remove/edit products
- Real-time preview of changes
- Draft and publish workflow

### Leads Manager
- View all leads in one place
- Filter by status (new, contacted, won, lost)
- Search by name, email, or phone
- Update lead status
- Export to CSV
- View analytics dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/me` - Get current user info

### Homepage
- `GET /api/homepage/current` - Get published homepage
- `POST /api/homepage/draft` - Create draft version
- `PUT /api/homepage/draft/:id` - Update draft
- `POST /api/homepage/:id/publish` - Publish version

### Leads
- `POST /api/leads` - Create new lead (public)
- `GET /api/leads` - List leads (with filters)
- `GET /api/leads/:id` - Get lead details
- `PUT /api/leads/:id` - Update lead
- `POST /api/leads/:id/notes` - Add note to lead
- `GET /api/leads/export.csv` - Export leads

### Analytics
- `GET /api/analytics/leads-summary` - Get leads analytics

### Audit
- `GET /api/audit` - View audit logs

## Database

The application uses SQLite database stored in `data/balaji_ghee.db`. The database is automatically created on first run with the following tables:
- `users` - Admin users
- `homepage_versions` - Versioned homepage content
- `site_state` - Current published version pointer
- `leads` - Customer leads
- `lead_notes` - Notes for leads
- `audit_logs` - System audit trail

## Security Features

- JWT-based authentication
- Password hashing with bcrypt (12 rounds)
- Role-based access control (MASTER/STAFF)
- Rate limiting on public endpoints
- CSRF protection
- Input validation

## Building for Production

```bash
npm run build
```

The built files will be in the `build/` directory.

## Production Deployment

1. Set a strong `JWT_SECRET` in your environment
2. Use a production-grade database (PostgreSQL, MySQL)
3. Set up proper SSL/TLS certificates
4. Configure rate limiting and CORS
5. Set up automated backups
6. Use process manager (PM2, systemd)
7. Configure reverse proxy (Nginx)

## Troubleshooting

**Database errors:**
- Ensure `data/` directory exists and is writable
- Check file permissions

**Port conflicts:**
- Change `PORT` in `.env` if 3001 is in use
- Update `API_BASE` in `src/lib/api.ts`

**Login issues:**
- Ensure user exists in database
- Check JWT_SECRET matches
- Clear browser localStorage

## Support

For issues or questions, please refer to the Figma design or contact support.

## License

Private - All rights reserved.
