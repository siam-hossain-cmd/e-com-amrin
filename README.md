# Amrin Exclusive - E-commerce Platform

A modern, full-featured e-commerce platform for hijabs and modest fashion.

## 🏗️ Project Structure

```
Amrin/
├── website/     # Customer-facing storefront (Next.js 14)
├── admin/       # Admin dashboard (Next.js 14)
└── shared/      # Shared utilities
```

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: CSS Variables, Custom Design System
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Auth
- **Image Storage**: Cloudinary
- **Analytics**: Google Analytics 4
- **Deployment**: Vercel

## 📦 Features

### Customer Website
- Product browsing with category filters
- Product search and filtering
- Shopping cart & wishlist
- User authentication (login/register)
- Checkout process
- Order tracking
- User profile & address management

### Admin Dashboard
- Dashboard with analytics
- Product management (CRUD)
- Inventory tracking with low stock alerts
- Order management
- Customer management
- Banner & promotional content
- Newsletter management
- Discount/voucher system

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account
- Firebase project
- Cloudinary account

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/amrin.git
cd amrin
```

2. **Install dependencies**
```bash
# Website
cd website && npm install

# Admin
cd ../admin && npm install
```

3. **Environment Variables**

Create `.env.local` in both `website/` and `admin/` folders:

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

4. **Run development servers**
```bash
# Terminal 1 - Website (port 3000)
cd website && npm run dev

# Terminal 2 - Admin (port 3001)
cd admin && npm run dev
```

## 🌐 Deployment (Vercel)

1. Push code to GitHub
2. Create two Vercel projects:
   - `amrin-website` → Root directory: `website`
   - `amrin-admin` → Root directory: `admin`
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📝 License

Private - All rights reserved.

---

Made with ❤️ for Amrin Exclusive
