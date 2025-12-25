# Amrin Order Management System

## Complete Order Lifecycle: From Checkout to Delivery

---

## 📦 Order Flow Overview

```
CUSTOMER                    ADMIN                      COURIER
   │                          │                          │
   ├─► Place Order            │                          │
   │   └─► Order Created ────►├─► See New Order          │
   │       (Pending)          │   └─► Review & Pack      │
   │                          │       └─► Book Courier ──►├─► Pickup
   │                          │           (Processing)    │   └─► Transit
   │◄── Shipping Email ──────┬├─► Enter Tracking #       │       └─► Delivery
   │   (Shipped)              │   (Shipped)               │           │
   │                          │                          ◄────────────┘
   └─► Track & Receive ◄──────┴─────────────────────────── (Delivered)
```

---

## 🔄 Order Statuses

| Status | Color | Description | Triggered By |
|--------|-------|-------------|--------------|
| **Pending** | 🟡 Yellow | Order just placed, awaiting review | Customer checkout |
| **Processing** | 🔵 Blue | Admin is packing items | Admin action |
| **Shipped** | 🟣 Purple | Package handed to courier | Admin enters tracking # |
| **Delivered** | 🟢 Green | Customer received package | Courier confirmation |
| **Cancelled** | 🔴 Red | Order was cancelled | Admin or customer |

---

## 📋 Detailed Step-by-Step Process

### Step 1: Customer Places Order
- Customer completes checkout on website
- Payment is processed
- Order is saved to database with status "Pending"
- Customer receives **Order Confirmation Email**
- Order appears in customer's "My Orders" page

### Step 2: Admin Reviews New Order
- Admin sees new order notification in dashboard
- Admin reviews:
  - Customer details
  - Shipping address
  - Items ordered
  - Payment status

### Step 3: Admin Packs Order
- Admin gathers items from inventory
- Prints packing slip
- Updates order status to **"Processing"**
- Customer sees status change on their order page

### Step 4: Admin Books Courier
**Manual Method:**
- Admin logs into Ninja Van dashboard (bizcloud.ninjavan.co)
- Creates new shipment with customer details
- Gets tracking number
- Schedules pickup or drops at Ninja Point

**API Method (Future):**
- System auto-books courier
- Auto-generates tracking number
- Auto-schedules pickup

### Step 5: Admin Ships Order
- Admin enters tracking number in system
- Updates status to **"Shipped"**
- Customer receives **Shipping Email** with tracking link

### Step 6: Customer Tracks Package
- Customer can track via:
  - "My Orders" page on Amrin website
  - Direct link to Ninja Van tracking
  - Email link

### Step 7: Delivery
- Courier delivers package
- Status updates to **"Delivered"**
- Customer receives **Delivery Confirmation Email**

---

## 🖥️ Admin Dashboard Features

### Orders Page
- List of all orders with filters:
  - Status (Pending, Processing, Shipped, etc.)
  - Date range
  - Search by order ID or customer name
- Quick actions: View, Update Status, Print

### Order Detail View
- Order information:
  - Order ID, Date, Status
  - Customer name, email, phone
  - Shipping address
  - Items with images, sizes, quantities
  - Order total breakdown
- Actions:
  - Update status dropdown
  - Enter tracking number
  - Print packing slip
  - Cancel order

---

## 📱 Customer Website Features

### My Orders Page (`/profile/orders`)
- List of all customer's orders
- Status badges with colors
- Quick access to order details

### Order Detail Page (`/orders/[id]`)
- Order status timeline
- Tracking number with link to courier
- Items ordered
- Shipping address
- Estimated delivery

---

## 📧 Email Notifications

| Trigger | Email Subject | Content |
|---------|--------------|---------|
| Order Placed | "Order Confirmed" | Order details, items, total |
| Processing | "Order Being Prepared" | Status update |
| Shipped | "Order Shipped" | Tracking number, courier link |
| Delivered | "Order Delivered" | Thank you, request review |

---

## 🔗 Courier Integration (Ninja Van)

### Option 1: Manual (Current)
1. Admin manually creates shipment on Ninja Van
2. Copies tracking number to Amrin system
3. Customer tracks on Ninja Van website

### Option 2: API Integration (Future)
- Auto-create shipments
- Auto-get tracking numbers
- Real-time status updates via webhooks
- Embedded tracking on Amrin website

**Ninja Van API Endpoints:**
- `POST /shipments` - Create shipment
- `GET /shipments/{id}` - Get shipment status
- `DELETE /shipments/{id}` - Cancel shipment
- Webhook for status updates

---

## 💰 Shipping Rates

| Destination | Rate | Free Shipping |
|-------------|------|---------------|
| Peninsular Malaysia | RM 5 | Orders ≥ RM 80 |
| East Malaysia | RM 10* | Orders ≥ RM 100* |

*East Malaysia rates can be configured later

---

## 🗄️ Database Structure

### Orders Collection
```javascript
{
  _id: ObjectId,
  orderNumber: "AMR-20251226-XXXX",
  userId: "firebase-uid",
  customer: {
    name: "Customer Name",
    email: "email@example.com",
    phone: "+60123456789"
  },
  shippingAddress: {
    address: "123 Street",
    city: "Kuala Lumpur",
    state: "Selangor",
    postcode: "50000",
    country: "Malaysia"
  },
  items: [
    {
      productId: "product-id",
      name: "Product Name",
      size: "Standard",
      color: "Nude",
      price: 45,
      quantity: 2,
      image: "url"
    }
  ],
  subtotal: 90,
  shipping: 5,
  total: 95,
  status: "pending|processing|shipped|delivered|cancelled",
  trackingNumber: "MYNV12345678",
  courier: "Ninja Van",
  paymentMethod: "card|fpx|ewallet|cod",
  paymentStatus: "paid|pending|failed",
  createdAt: Date,
  updatedAt: Date,
  shippedAt: Date,
  deliveredAt: Date
}
```

---

## 🚀 Implementation Checklist

- [ ] Create Orders API (`/api/orders`)
- [ ] Create order when checkout completes
- [ ] Admin orders page with list and filters
- [ ] Admin order detail page
- [ ] Update order status functionality
- [ ] Add tracking number functionality
- [ ] Customer order history page
- [ ] Customer order detail with tracking
- [ ] Order confirmation email
- [ ] Shipping notification email
- [ ] Delivery confirmation email
- [ ] Print packing slip feature

---

## 📞 Support Flow

If customer has issue:
1. Customer contacts via WhatsApp/email
2. Admin looks up order by order number
3. Admin checks tracking status
4. Admin communicates with customer
5. If needed, admin contacts courier

---

*Document created: December 26, 2025*
