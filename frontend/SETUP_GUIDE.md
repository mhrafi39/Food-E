# 🚀 Quick Setup Guide - ফুড-ই (Food-E)

## ✅ Installation Complete!

Your premium restaurant web application is ready to use!

### 🌐 Access Your Application

**Development Server**: http://localhost:5173/

The server is currently running. You can view your application in your browser.

---

## 📋 Quick Customization Checklist

### 1️⃣ Update WhatsApp Number (IMPORTANT!)

Replace `+8801XXXXXXXXX` with your actual WhatsApp business number in these files:

- [ ] `src/components/FloatingWhatsApp.jsx` (Line 5)
- [ ] `src/components/Footer.jsx` (Line 32 & 70)
- [ ] `src/pages/Checkout.jsx` (Line 67)

### 2️⃣ Update Business Information

#### Location & Address
Edit `src/components/Footer.jsx`:
- Update "Banani, Dhaka" to your actual location (Line 58)
- Update Google Maps link (Line 52)

#### Operating Hours
Edit `src/components/Footer.jsx`:
- Change "Open Daily: 11 AM - 11 PM" (Line 83)

#### Social Media Links
Edit `src/components/Footer.jsx`:
- Facebook link (Line 25)
- Instagram link (Line 33)

### 3️⃣ Customize Menu Items

Edit `src/pages/Menu.jsx` (starting Line 17) to add/edit your actual food items:

```javascript
{
  id: 'unique-id',
  name: 'Food Name',
  description: 'Food description',
  price: 350,  // Price in BDT
  category: 'burgers',  // or 'fries' or 'drinks'
  emoji: '🍔',
  badge: 'Optional Badge Text',
}
```

### 4️⃣ Customize Deals

Edit `src/pages/Deals.jsx` (starting Line 10) to add your combo offers.

### 5️⃣ Update Brand Colors (Optional)

Edit `tailwind.config.js`:
```javascript
colors: {
  brand: '#FF5F00',  // Primary orange color
  matte: '#121212',  // Dark background
}
```

---

## 🎯 Key Features Tour

### Navigation
- **Home**: Welcome page with featured items
- **Menu**: Browse all food items, search and filter
- **Deals**: View combo offers with discounts
- **Checkout**: Complete order with WhatsApp integration
- **Track Order**: Demo tracking interface
- **Login**: Demo authentication page

### Shopping Cart
- Click the cart icon (top-right) to view your cart
- Add items from Menu or Deals pages
- Adjust quantities in the cart sidebar
- Cart data persists in browser storage

### Mobile Experience
- 🍔 Hamburger menu for mobile navigation
- 💬 Floating WhatsApp button (mobile only)
- 📱 Fully responsive design

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📱 WhatsApp Order Flow

1. Customer adds items to cart
2. Goes to Checkout page
3. Fills delivery details (name, phone, address)
4. Clicks "Place Order via WhatsApp"
5. Order details are formatted and sent via WhatsApp
6. You receive the order message on your WhatsApp business number
7. Confirm order directly through WhatsApp

---

## 🎨 Color Scheme

- **Brand Orange**: `#FF5F00` - Buttons, accents, highlights
- **Matte Black**: `#121212` - Background
- **White**: Text and borders with opacity variations
- **Green**: "Open Now" badge, success states

---

## 📂 Project Structure Overview

```
src/
├── components/        → Reusable UI components
├── pages/            → Page components (routes)
├── context/          → Global state (Cart)
├── App.jsx           → Route configuration
├── main.jsx          → App entry point
└── index.css         → Global styles
```

---

## 🔥 Next Steps

1. ✅ Application is running at http://localhost:5173/
2. 📝 Update WhatsApp number and business info
3. 🍔 Customize menu items with your actual products
4. 🎨 Add real food images (optional)
5. 📱 Test on mobile devices
6. 🚀 Build and deploy to production

---

## 💡 Tips

### Adding Food Images
Replace emoji with actual images:
```javascript
{
  id: 'm1',
  name: 'Burger',
  image: '/images/burger.jpg',  // Instead of emoji
  // ... other properties
}
```

Then place images in `public/images/` folder.

### Deployment
Build the app and deploy the `dist` folder to:
- Netlify (recommended)
- Vercel
- GitHub Pages
- Any static hosting service

### Testing WhatsApp
Use your personal number first to test the order flow before using business number.

---

## 🆘 Troubleshooting

**Cart not updating?**
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`

**Page not loading?**
- Check development server is running
- Refresh browser (Cmd/Ctrl + Shift + R)

**Styling issues?**
- Ensure Tailwind is compiling
- Check PostCSS configuration

---

## 📞 Support

This is a complete, production-ready frontend application. For backend integration, you'll need to:
- Build a REST API for orders
- Implement real authentication
- Add payment gateway
- Set up a database

---

**Happy Coding! 🎉**

*Made with ❤️ for ফুড-ই (Food-E)*
