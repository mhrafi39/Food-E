# Notification System - Visual Guide

## 🎯 What Users Will See

### Desktop View

#### 1. Navbar with Notification Bell
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ফুড-ই    Home    Menu    Deals    🔔[2]   [👤 John]  [↗]       │
│                                     └─ 2 unread                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
         Click bell to open notification panel ↓
```

#### 2. Notification Panel (After Click)
```
┌─────────────────────────────────────────┐
│ Notifications                       [✕] │
│ 2 unread                                │
├─────────────────────────────────────────┤
│                                         │
│ 🔵 Your order is placed               │
│    successfully. Order #: 456           │
│    Just now                      [✓] [✕]│
│                                         │
│ ⚪ Your order is placed               │
│    successfully. Order #: 455           │
│    2h ago                           [✕]│
│                                         │
├─────────────────────────────────────────┤
│ [✓✓ Mark all as read]   [🗑️ Delete all]│
└─────────────────────────────────────────┘
```

### Mobile View

#### Navbar (Mobile)
```
┌─────────────────────────┐
│ ফুড-ই        🔔[2] [☰] │
└─────────────────────────┘
```

#### Notification Panel (Mobile - Full Width)
```
┌────────────────────────────┐
│ Notifications         [✕]  │
│ 2 unread                   │
├────────────────────────────┤
│ 🔵 Your order is placed   │
│    successfully...         │
│    Just now        [✓] [✕]│
├────────────────────────────┤
│ ⚪ Your order is placed   │
│    successfully...         │
│    2h ago              [✕]│
├────────────────────────────┤
│ [✓✓ Mark all as read]      │
│ [🗑️ Delete all]            │
└────────────────────────────┘
```

---

## 🔄 User Journey

### Step 1: User Places Order
```
User
  ↓
Add items to cart
  ↓
Click "Checkout"
  ↓
Fill order details
  ↓
Click "Place Order"
  ↓
OrdersController.PostOrder()
  ├─ Extract userId from JWT
  ├─ Save order with userId
  ├─ Create notification
  └─ Create success response
  ↓
Order Confirmation Page
```

### Step 2: Notification Appears
```
Order Placed ✓
  ↓
Backend creates notification
  ├─ UserId: 123
  ├─ Message: "Your order is placed..."
  ├─ RelatedOrderId: 456
  ├─ IsRead: false
  └─ CreatedAt: now
  ↓
Frontend detects unread notification
  ↓
Navbar bell updates:
  └─ Shows badge with count [1]
```

### Step 3: User Opens Notification Panel
```
User clicks bell icon
  ↓
NotificationPanel opens
  ↓
Fetch notifications from API:
  GET /api/notifications
  ↓
Render notifications:
  ├─ Unread notifications highlighted (blue)
  ├─ Read notifications normal
  ├─ Each with timestamp (relative)
  └─ Action buttons (✓, ✕)
  ↓
User can now:
  • View message
  • Mark as read (single)
  • Mark all as read
  • Delete (single)
  • Delete all
```

### Step 4: Manage Notifications
```
Option A: Mark as Read
  ├─ Click [✓] button
  ├─ Notification.IsRead = true
  ├─ Badge count decreases
  └─ UI updates

Option B: Mark All as Read
  ├─ Click [✓✓ Mark all as read]
  ├─ All notifications updated
  ├─ Badge disappears (count = 0)
  └─ UI updates

Option C: Delete
  ├─ Click [✕] button
  ├─ Notification deleted
  ├─ Badge count decreases
  └─ Notification removed from list

Option D: Delete All
  ├─ Click [🗑️ Delete all]
  ├─ Confirmation dialog appears
  ├─ All notifications deleted
  ├─ Badge disappears
  └─ Panel shows "No notifications"
```

---

## 🎯 Color Coding

### Notification States

```
UNREAD (New)
┌──────────────────────────────────────┐
│ 🔵 Your order is placed...          │  ← Blue background (highlighted)
│    Just now                  [✓] [✕]│  ← Has "mark as read" button
└──────────────────────────────────────┘

READ (Already viewed)
┌──────────────────────────────────────┐
│ ⚪ Your order is placed...          │  ← Normal background
│    2h ago                        [✕]│  ← Only delete button
└──────────────────────────────────────┘

DELETED (Removed)
   [Notification not shown]
```

### Badge Colors

```
┌─────────────┐
│ 🔔[2]       │  ← Red background = Unread
├─────────────┤
│ 🔔          │  ← No badge = All read
└─────────────┘
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Navbar: 🔔[2] ← Click → NotificationPanel              │   │
│  │                           ├─ List of notifications       │   │
│  │                           ├─ [✓] Mark as read buttons    │   │
│  │                           ├─ [✕] Delete buttons          │   │
│  │                           ├─ [✓✓ Mark all as read]       │   │
│  │                           └─ [🗑️ Delete all]            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (HTTP)
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API ENDPOINTS                        │
│  GET    /api/notifications              → All notifications     │
│  GET    /api/notifications/unread-count → Unread count         │
│  PUT    /api/notifications/{id}/read    → Mark single as read  │
│  PUT    /api/notifications/mark-all-read → Mark all as read   │
│  DELETE /api/notifications/{id}         → Delete single        │
│  DELETE /api/notifications/delete-all   → Delete all           │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (EF Core)
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                            │
│  ┌──────────────────────────────────────┐                      │
│  │ Notifications Table                  │                      │
│  │ ├─ Id (int, PK)                      │                      │
│  │ ├─ UserId (int, FK)  ─────┐          │                      │
│  │ ├─ Message (string)       │          │                      │
│  │ ├─ Type (string)          │          │                      │
│  │ ├─ RelatedOrderId (int)   │  ┌─────┐│                      │
│  │ ├─ IsRead (bool)          │  │     ││                      │
│  │ └─ CreatedAt (datetime)   │  │     ││                      │
│  └──────────────────────────────┼──────┤│                      │
│                                 │      ││                      │
│  ┌──────────────────────────────┘      ││                      │
│  │ Users Table                         ││                      │
│  │ ├─ Id (int, PK)                     ││                      │
│  │ ├─ Name (string)                    ││                      │
│  │ ├─ Email (string)                   ││                      │
│  │ ├─ Password (string)                ││                      │
│  │ └─ Role (string)                    ││                      │
│  └─────────────────────────────────────┘│                      │
│                                          │                      │
│  ┌──────────────────────────────────────┘                      │
│  │ Orders Table                                                │
│  │ ├─ Id (int, PK)                                            │
│  │ ├─ UserId (int, FK)                                        │
│  │ ├─ CustomerName (string)                                  │
│  │ ├─ Email (string)                                         │
│  │ ├─ Phone (string)                                         │
│  │ ├─ Address (string)                                       │
│  │ ├─ Status (string)                                        │
│  │ └─ ... more fields ...                                    │
│  └──────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Flow

```
User Request
  ↓
JWT Token (from localStorage)
  ├─ Contains: userId, name, email, role
  └─ Sent in Authorization header
  ↓
Backend Receives Request
  ↓
[Authorize] Attribute
  ├─ Validates JWT signature
  ├─ Extracts claims
  └─ Sets User context
  ↓
Get Current UserId
  ├─ Extract from ClaimTypes.NameIdentifier
  └─ Use for data filtering
  ↓
Database Query
  ├─ Filter by UserId == current user
  ├─ ONLY return user's notifications
  └─ Prevent data leakage
  ↓
Response
  └─ Only user's data
```

---

## ⏰ Auto-Refresh Cycle

```
Component Mounts
  ↓
useEffect Hook Triggers (isAuthenticated changes)
  ↓
Fetch initial unread count
  ├─ GET /api/notifications/unread-count
  └─ Update badge
  ↓
Set 30-second interval
  ├─ Timer starts
  └─ RefreshInterval = setInterval(...)
  ↓
Every 30 seconds:
  ├─ Fetch current unread count
  ├─ Compare with previous count
  ├─ Update badge if changed
  └─ User sees badge update
  ↓
Component Unmounts or Auth Changes
  ├─ Clear interval
  └─ Cleanup
```

---

## 🚀 Notification Lifecycle

```
CREATED
  ├─ Created automatically when order placed
  ├─ UserId: Set to current authenticated user
  ├─ IsRead: false
  ├─ CreatedAt: Current timestamp
  └─ RelatedOrderId: Order ID
  ↓
IN_SYSTEM
  ├─ Stored in database
  ├─ Visible in notification panel
  ├─ Counted in unread badge
  └─ Listed chronologically (newest first)
  ↓
MARKED_READ (Optional)
  ├─ User clicks [✓] or [✓✓ Mark all as read]
  ├─ IsRead: true
  ├─ Still visible in panel
  ├─ Not counted in unread badge
  └─ No "mark as read" button anymore
  ↓
DELETED (Optional)
  ├─ User clicks [✕] or [🗑️ Delete all]
  ├─ Removed from database
  ├─ No longer visible in panel
  ├─ Not counted in any badge
  └─ Data permanently removed
  ↓
EXPIRED (Future Enhancement)
  ├─ Auto-delete after N days (optional)
  ├─ Archive old notifications (optional)
  └─ Keep database clean (optional)
```

---

## 📱 Responsive Behavior

### Desktop (≥768px)
```
✓ Notification bell visible in navbar
✓ Click bell → Slide-in panel from right
✓ Panel width: 384px (96 * 4)
✓ Position: Fixed top-right
✓ Overlay: 40% opacity backdrop
✓ Full features available
```

### Mobile (<768px)
```
✓ Notification bell visible in navbar
✓ Click bell → Full-width panel
✓ Panel width: calc(100vw - 2rem)
✓ Position: Fixed top-right
✓ Overlay: 40% opacity backdrop
✓ All features available
✓ Touch-optimized buttons
```

---

## ✨ Visual Animations

### Panel Entrance
```
Initial:  opacity=0, x=20px
Animate:  opacity=1, x=0
Duration: 0.2s (spring)
```

### Notification Item
```
Initial:  opacity=0, y=10px
Animate:  opacity=1, y=0
Duration: 0.15s per item
Stagger:  Slight delay between items
```

### Badge Update
```
Initial:  No animation
On Change: Number updates instantly
Effect:   User sees badge change
```

---

This visual guide shows exactly how users interact with the notification system! 🎯
