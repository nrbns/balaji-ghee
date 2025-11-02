# Delivery System Implementation Plan

## Current Stack
- **Frontend:** React + Vite + React Router
- **Backend:** Node.js + Express
- **Database:** SQLite (current) → **Upgrade to Firebase/Firestore**
- **Auth:** JWT + bcrypt → **Upgrade to Firebase Auth**

## Architecture Decision

**Recommended: Hybrid Approach**
- Keep React frontend
- Migrate to **Firebase** for auth, real-time data, and scalability
- Add **Shiprocket** for delivery management
- Use **Socket.io** for chat (integrate with existing Express server)

**Why Firebase?**
- Fast Phone OTP setup
- Real-time Firestore for orders/chat
- Built-in FCM push notifications
- Scale without infrastructure

---

## Phase 1: Firebase Setup & Auth (2-3 days)

### 1.1 Firebase Project Setup
```bash
npm install firebase
```

### 1.2 Firebase Configuration
Create `src/lib/firebase.ts`:
- Initialize Firebase
- Configure Phone Auth + Recaptcha
- Set up Google Auth provider
- Configure Firestore

### 1.3 Auth Migration
Replace JWT system with Firebase Auth:
- Phone OTP login
- Google Sign-in
- Role-based access (custom claims)
- Migrate existing users (optional)

### 1.4 Firestore Collections
Create data model:
```
users/{uid}
  - name, phone, email, role, createdAt

orders/{orderId}
  - userId, items, amount, address, status, 
  - shipment: {awb, trackingId, provider}
  - assignedEmployeeId, createdAt

shipments/{shipmentId}
  - orderId, status, checkpoints[], eta, raw

chats/{roomId}
  - orderId, userId, employeeId
  - messages[]: {from, text, timestamp, seen}

leads/{leadId}
  - userId, source, status, notes, createdAt
```

---

## Phase 2: Shiprocket Integration (3-4 days)

### 2.1 API Setup
- Create Shiprocket account
- Generate API credentials
- Add to environment variables

### 2.2 Create Order Endpoint
```
POST /api/shiprocket/create-order
Body: { pickup, drop, items, payment_mode, cod_amount }
Response: { awb, tracking_id, link }
```

### 2.3 Webhook Handler
```
POST /api/shiprocket/webhook
- Receive tracking updates
- Update Firestore shipments collection
- Trigger notifications
```

### 2.4 Order Status Flow
```
created → packed → ready_to_pick → out_for_delivery → delivered
```

---

## Phase 3: Checkout & Address Management (2-3 days)

### 3.1 Checkout Page
- Cart review
- Address selection/input
- Payment method selection
- Order summary

### 3.2 Address Management
- Add/edit/delete addresses
- Validate format
- Google Places autocomplete (optional)

### 3.3 Order Creation
- Convert cart to order
- Calculate shipping
- Create Shiprocket shipment
- Store AWB
- Send confirmation email

---

## Phase 4: Order Tracking UI (2-3 days)

### 4.1 My Orders Page
- List user's orders
- Filter by status
- Search by order ID

### 4.2 Order Detail Page
- Full order info
- Timeline of checkpoints
- Map view (if available)
- Contact support button
- Reorder button

### 4.3 Live Tracking Widget
- Show real-time status
- ETA updates
- Delivery agent contact
- Live map (optional)

---

## Phase 5: Employee Dashboard (3-4 days)

### 5.1 Employee Portal
- Login with role check
- View assigned orders
- SLA monitoring
- Performance metrics

### 5.2 Order Management
- Mark as packed
- Assign delivery partner
- Update status
- Add notes

### 5.3 Dashboard Views
- Today's orders
- Pending orders
- SLA breaches
- Order statistics

---

## Phase 6: Real-time Chat (2-3 days)

### 6.1 Socket.io Setup
```bash
npm install socket.io socket.io-client
```

### 6.2 Chat Rooms
- Per-order chat room
- User ↔ Employee messaging
- System notifications
- Typing indicators

### 6.3 Chat UI Component
- Message list
- Input with send button
- Unread badges
- Notification sounds

---

## Phase 7: Notifications & Admin Features (2-3 days)

### 7.1 Push Notifications
- FCM integration
- Order status updates
- Delivery alerts
- Chat messages

### 7.2 Admin Master Panel
- All orders view
- Lead management
- Employee management
- Analytics dashboard
- SLA monitoring

---

## Tech Stack Summary

### Add These Packages
```bash
npm install firebase
npm install socket.io socket.io-client
npm install react-otp-input
npm install react-google-places-autocomplete  # Optional
```

### Environment Variables
```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Shiprocket
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
SHIPROCKET_WEBHOOK_URL=

# Socket.io
SOCKET_SERVER_URL=
```

---

## API Endpoints to Add

```
POST   /api/auth/phone/verify
POST   /api/auth/google/login
POST   /api/orders/create
GET    /api/orders/:id
GET    /api/orders/user/:userId
PUT    /api/orders/:id/status
POST   /api/shiprocket/create-order
POST   /api/shiprocket/webhook
GET    /api/shiprocket/track/:awb
GET    /api/chats/room/:orderId
POST   /api/chats/room/:orderId/message
GET    /api/employee/orders
PUT    /api/employee/orders/:id/assign
```

---

## Database Migration Strategy

### Option A: Parallel Run (Recommended)
1. Keep SQLite for admin CMS
2. Use Firestore for orders/chat
3. Migrate gradually

### Option B: Full Migration
1. Export SQLite data
2. Import to Firestore
3. Switch all operations

---

## Security Checklist

- [ ] Firebase Security Rules for Firestore
- [ ] Role-based access control
- [ ] Input validation
- [ ] Rate limiting
- [ ] Webhook signature verification
- [ ] PII protection
- [ ] HTTPS only
- [ ] CORS configuration

---

## Testing Plan

1. **Auth Flow:** Phone OTP, Google login, logout
2. **Order Creation:** From cart to Shiprocket
3. **Tracking:** Status updates, notifications
4. **Chat:** Real-time messaging
5. **Employee Flow:** Order management
6. **Admin Flow:** Dashboard, analytics

---

## Deployment

### Firebase Hosting (Frontend)
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

### Backend (VPS/Cloud Run)
- Deploy Express + Socket.io server
- Configure webhooks
- Set up SSL
- Environment variables

---

## Timeline Estimate

**Total: 16-20 days for full implementation**
- Firebase + Auth: 2-3 days
- Shiprocket: 3-4 days
- Checkout: 2-3 days
- Tracking UI: 2-3 days
- Employee Dashboard: 3-4 days
- Chat: 2-3 days
- Admin Features: 2-3 days
- Testing & Polish: 2-3 days

---

## Next Steps

**Would you like me to:**
1. Start with Firebase setup and auth migration?
2. Set up Shiprocket integration first?
3. Build checkout flow?
4. Create employee dashboard?

Let me know your priority and I'll implement it step by step!

