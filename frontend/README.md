# 🍔 ফুড-ই (Food-E) - Premium Restaurant Web Application

A modern, fully-responsive React application for a premium single-restaurant brand in Dhaka, Bangladesh. Built with React, Vite, Tailwind CSS, and Framer Motion.

![Theme](https://img.shields.io/badge/Theme-Matte%20Black%20%26%20Orange-FF5F00)
![Framework](https://img.shields.io/badge/Framework-React%2018-61DAFB)
![Build](https://img.shields.io/badge/Build-Vite-646CFF)

## ✨ Features

### 🎨 Design & UI
- **Premium Theme**: Matte Black (#121212) with vibrant Orange (#FF5F00) accents
- **Glassmorphic Design**: Modern glass effect components
- **Responsive**: Mobile-first design, fully responsive across all devices
- **Animations**: Smooth page transitions and hover effects with Framer Motion
- **Bengali & English**: Bilingual interface with Bengali brand name

### 📱 Pages & Components

#### Pages
- **Home**: Hero section, featured best sellers slider, and premium quality showcase
- **Menu**: Categorized food items (Burgers, Fries, Drinks) with search functionality
- **Deals**: Exclusive combo offers with savings badges
- **Checkout**: Two-column layout with delivery details and order summary
- **Track Order**: Real-time order tracking with progress indicators
- **Login**: Authentication page with login/signup tabs

#### Components
- **Navbar**: Glassmorphic navigation with pulsing "Open Now" badge and dynamic cart counter
- **Footer**: Contact information, location link, and call-to-order button
- **FoodCard**: Reusable product card with animations
- **CartSidebar**: Slide-out cart with add/remove/update functionality
- **FloatingWhatsApp**: Mobile-only floating WhatsApp button

### 🛒 Shopping Experience
- **Authentication Required**: Users must login to place orders
- **Food Customization**: Detailed pages for each item with size, extras, and sauce options
- **Complementary Items**: Each food shows what comes with it (fries, sauces, etc.)
- **Similar Suggestions**: Related items shown on detail pages
- **Cart Management**: Add, remove, and update quantities
- **Local Storage**: Cart and user session persist across browser sessions
- **Real-time Updates**: Cart count updates instantly across all pages
- **Multiple Payment Methods**: 
  - 💵 Cash on Delivery
  - 📱 bKash (pay on delivery)
  - 📲 Nagad (pay on delivery)
  - 🚀 Rocket (pay on delivery)
  - 💰 Advance Payment (via bKash/Nagad/Rocket)
- **WhatsApp Integration**: Send orders directly via WhatsApp with payment method included

### 🎯 Key Technologies
- **React 19** with Hooks and Context API
- **React Router DOM v6** for routing
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for fast development and building

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── MainLayout.jsx       # Main wrapper component
│   ├── Navbar.jsx           # Navigation with cart & user info
│   ├── Footer.jsx           # Footer with contact info
│   ├── FoodCard.jsx         # Product display card (clickable)
│   ├── CartSidebar.jsx      # Shopping cart sidebar
│   └── FloatingWhatsApp.jsx # WhatsApp floating button
├── pages/
│   ├── Home.jsx             # Landing page
│   ├── Menu.jsx             # Food menu with categories
│   ├── FoodDetail.jsx       # Food detail with customization
│   ├── Deals.jsx            # Special combo deals
│   ├── Checkout.jsx         # Order checkout (protected)
│   ├── TrackOrder.jsx       # Order tracking
│   └── Login.jsx            # Authentication
├── context/
│   ├── CartContext.jsx      # Global cart state
│   └── AuthContext.jsx      # Authentication state
├── App.jsx                  # Route configuration
├── main.jsx                 # App entry point
└── index.css                # Global styles
```

## 🎨 Customization

### Update Brand Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      brand: '#FF5F00',  // Your primary color
      matte: '#121212',  // Your background color
    }
  }
}
```

### Update WhatsApp Number

Replace `+8801XXXXXXXXX` or `8801XXXXXXXXX` with your actual WhatsApp number in:
- `src/components/FloatingWhatsApp.jsx`
- `src/components/Footer.jsx`
- `src/pages/Checkout.jsx` (WhatsApp order integration)
- `src/pages/Checkout.jsx` (Advance payment instructions - update `01XXX-XXXXXX`)

### Update Business Information

- **Location**: Update in `src/components/Footer.jsx`
- **Opening Hours**: Update in `src/components/Footer.jsx`
- **Social Media**: Add links in `src/components/Footer.jsx`

## 🔧 Configuration

### Tailwind CSS
Custom utilities are defined in `src/index.css`:
- `.glass` - Glassmorphic effect
- `.gradient-brand` - Brand gradient background

### Animation
Page transitions are configured in `src/App.jsx` using Framer Motion's `AnimatePresence`.

## 📱 WhatsApp Integration

The checkout process sends a formatted order message to WhatsApp including:
- Customer details (name, phone, address)
- Order items with quantities
- Payment method (Cash/bKash/Nagad/Rocket/Advance)
- Total price in BDT (৳)
- Special instructions
- Advance payment instructions (if selected)

### Payment Methods
The checkout page supports multiple payment options:

1. **Cash on Delivery** - Customer pays when receiving the order
2. **bKash** - Mobile payment on delivery
3. **Nagad** - Mobile payment on delivery
4. **Rocket** - Mobile payment on delivery
5. **Advance Payment** - Customer pays before delivery via bKash/Nagad/Rocket
   - Shows payment instructions with your mobile number
   - Customer sends transaction ID via WhatsApp

## 🔐 Authentication System

2. **Customize**: Click any food item to see details and customization options
   - Select size (Regular, Large, X-Large)
   - Add extras (cheese, bacon, extra patty, etc.)
   - Choose sauces (ketchup, mayo, BBQ, etc.)
   - See complementary items included
   - View similar food suggestions
3. **Add to Cart**: Choose quantity and add customized item
4. **Login**: Click checkout → redirected to login if not authenticated
5. **Checkout**: Fill delivery address (name/phone auto-filled)
6. **Select Payment**: Choose from Cash on Delivery, bKash, Nagad, Rocket, or Advance Payment
7. **Place Order**: Send via WhatsApp with order details and payment method

##e app includes a complete authentication flow:

### How It Works
1. **Browse freely**: Users can browse Menu, Deals, and add items to cart without logging in
2. **Login required**: When attempting to checkout, users are redirected to login
3. **Session persistence**: User sessions are saved in localStorage
4. **Auto-fill checkout**: Name and phone are pre-filled from logged-in user data

### Demo Login
- Enter any phone number and password to create a demo account
- The system stores user data locally (no backend required)
- In production, replace with real authentication API

### Features
- Login/Signup toggle
- User info displayed in navbar
- Logout functionality
- Protected checkout route
- Redirect to intended page after login

## 🛒 Shopping Flow

### Cart System
- **Add to Cart**: From Menu and Deals pages
- **Update Quantity**: Increase/decrease from cart sidebar
- **Remove Items**: Delete individual items
- **Persistent Storage**: Cart saved in localStorage
- **Real-time Sync**: Cart count updates across all pages

### Search & Filter
- **Category Filter**: Filter by Burgers, Fries, Drinks
- **Search Bar**: Search food by name or description
- **Live Results**: Instant filtering as you type

### Responsive Design
- **Mobile Navigation**: Slide-out drawer menu on mobile
- **Adaptive Layout**: Optimized layouts for mobile, tablet, and desktop
- **Touch-Friendly**: Large tap targets for mobile users

## 🎯 Future Enhancements

- [ ] Backend API integration
- [ ] Real order tracking system
- [ ] Payment gateway integration
- [ ] User authentication with JWT
- [ ] Order history
- [ ] Reviews and ratings
- [ ] Loyalty program
- [ ] Push notifications

## 📝 Notes

- **Authentication**: Users must login to place orders (demo mode - no backend)
- **Order Processing**: Via WhatsApp (no backend required initially)
- **Track Order**: Uses mock data (implement real tracking in production)
- **User Data**: Stored in localStorage (implement secure backend in production)

## 🤝 Contributing

This is a student project. Feel free to fork and customize for your own restaurant!

## 📄 License

This project is open source and available for educational purposes.

---

**Built with ❤️ for ফুড-ই (Food-E)**

*Premium Bangladesh Burgers & Fries in Dhaka*

