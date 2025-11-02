# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install
```bash
npm install
```

### Step 2: Create .env file
Create `.env` in the root:
```
PORT=3001
JWT_SECRET=my-super-secret-jwt-key-change-in-production
```

### Step 3: Start Everything
```bash
npm run dev:full
```

This starts:
- 🎨 Frontend at http://localhost:3000
- 🔧 Backend at http://localhost:3001

### Step 4: Create Admin Account

Run the initialization script:
```bash
npm run init
```

Follow the prompts to create your MASTER admin account.

**Alternative - Manual Registration (after starting server):**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@balajighee.com","password":"SecurePass123!","role":"MASTER"}'
```

### Step 5: Login
1. Open http://localhost:3000
2. Click "Master Panel" button (bottom-right)
3. Login with your credentials
4. Start managing!

## 📋 What You Get

✅ **Homepage Editor** - Edit hero, products, images in real-time
✅ **Leads Manager** - View, filter, export all leads
✅ **Analytics Dashboard** - Track lead sources and conversions
✅ **Secure Login** - JWT authentication with role-based access
✅ **Contact Form** - Built-in form on homepage that captures leads

## 🎯 Next Steps

1. **Customize** - Edit hero, products, images
2. **Test Contact Form** - Submit a test lead via homepage form
3. **View Leads** - Check Leads Manager tab
4. **Export** - Export leads to CSV
5. **Deploy** - Follow SETUP_GUIDE.md for production

## 📚 Need More Help?

- See `SETUP_GUIDE.md` for detailed documentation
- See `README.md` for full API reference
- Contact support for questions

## 🔍 Common Issues

**Port in use?**
Change PORT in .env

**Login not working?**
Clear browser localStorage: Press F12 → Console → `localStorage.clear()`

**Database errors?**
Delete `data/balaji_ghee.db` and restart

**CORS errors?**
Make sure backend is running on port 3001

---

**Ready to go!** 🎉

