# Notification System Implementation Guide

## Overview
A complete notification system has been added to the FoodE-Backend application. Each user has separate notifications that are specific to their account and orders.

## Backend Changes

### 1. Notification Model (`Model/Notification.cs`)
- **UserId**: Links notification to a specific user
- **Message**: Notification text displayed to user
- **Type**: Category of notification (default: "order")
- **RelatedOrderId**: Links notification to specific order
- **IsRead**: Tracks if user has read the notification
- **CreatedAt**: Timestamp of notification creation

### 2. NotificationsController (`Controllers/NotificationsController.cs`)
Provides the following endpoints:

#### GET Endpoints:
- `GET /api/notifications` - Get all notifications for current user
  - Query param: `unreadOnly` (boolean) - Filter unread notifications only
  - Returns: List of notifications ordered by creation date (newest first)

- `GET /api/notifications/unread-count` - Get count of unread notifications
  - Returns: `{ unreadCount: number }`

#### PUT Endpoints:
- `PUT /api/notifications/{id}/read` - Mark single notification as read
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read
  - Returns: Count of updated notifications

#### DELETE Endpoints:
- `DELETE /api/notifications/{id}` - Delete single notification
- `DELETE /api/notifications/delete-all` - Delete all notifications
  - Returns: Count of deleted notifications

**Authentication**: All endpoints require JWT authentication via Bearer token

### 3. Order Model Updates
Added `UserId` field to track which user placed the order (nullable for guest orders)

### 4. OrdersController Updates
When an order is created:
1. Captures the authenticated user's ID from JWT claims
2. Sets the `UserId` on the Order
3. Creates a notification for the user with message: "Your order is placed successfully. Order #: {orderId}"

### 5. Database Migrations
- Migration 1: Creates Notifications table with proper foreign keys and indexes
- Migration 2: Adds UserId field to Orders table with foreign key relationship

## Frontend Changes

### 1. NotificationPanel Component (`ClientApp/src/components/NotificationPanel.jsx`)
A modal panel that displays:
- List of all user notifications
- Notification messages with timestamps
- Unread indicator (highlighted with brand color)
- Individual delete button for each notification
- "Mark as read" button for unread notifications
- "Mark all as read" button
- "Delete all" button

**Features:**
- Auto-loads notifications when panel opens
- Real-time deletion and status updates
- Time-relative display (e.g., "5m ago", "2h ago")
- Responsive design for mobile and desktop
- Smooth animations using Framer Motion

### 2. Navbar Updates
Added:
- Notification bell icon in desktop navigation
- Red badge showing unread notification count (displays "9+" for 10+)
- Auto-refresh of unread count every 30 seconds
- Click to open/close NotificationPanel
- NotificationPanel component integration

## Database Schema

### Notifications Table
```sql
CREATE TABLE [Notifications] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [Message] nvarchar(max) NOT NULL,
    [Type] nvarchar(max) NOT NULL,
    [RelatedOrderId] int NULL,
    [IsRead] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Notifications] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Notifications_Users_UserId] FOREIGN KEY ([UserId]) 
        REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Notifications_UserId] ON [Notifications] ([UserId]);
```

### Orders Table Modifications
- Added: `[UserId] int NULL`
- Added: Foreign key constraint to Users table
- Added: Index on UserId

## How It Works

### User Flow:
1. User logs in → JWT token stored with userId claim
2. User places an order → OrdersController captures userId from JWT
3. Order saved to database with UserId
4. Notification created: "Your order is placed successfully. Order #: X"
5. User sees notification bell with unread count
6. User clicks bell → NotificationPanel opens
7. User can:
   - View all notifications
   - Mark single notification as read
   - Mark all notifications as read
   - Delete individual notifications
   - Delete all notifications

### Data Security:
- All notification endpoints require JWT authentication
- Users can only access their own notifications (filtered by userId)
- Notifications are automatically deleted when user is deleted (CASCADE)

## Testing the System

### Scenario 1: Create Order and See Notification
1. Login as user
2. Add items to cart
3. Checkout and create order
4. Check navbar - notification bell should show unread count
5. Click bell to open panel
6. See notification: "Your order is placed successfully. Order #: X"

### Scenario 2: Manage Notifications
1. Open notification panel
2. Click check icon on unread notification → Marked as read
3. Click "Mark all as read" → All unread marked as read
4. Click trash icon → Delete notification
5. Click "Delete all" → Delete all notifications

### Scenario 3: Unread Count Updates
1. Open notification panel
2. Leave panel open and place a new order in another tab
3. Unread count in bell badge should update automatically after 30 seconds
4. Or manually refresh by closing and reopening panel

## API Usage Examples

### Get All Notifications
```javascript
fetch('http://localhost:5000/api/notifications', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

### Mark All as Read
```javascript
fetch('http://localhost:5000/api/notifications/mark-all-read', {
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

### Delete All Notifications
```javascript
fetch('http://localhost:5000/api/notifications/delete-all', {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

## Future Enhancements
- Real-time notifications using SignalR
- Email notifications for important events
- Notification preferences per user
- Push notifications
- Notification categories (order, system, promotion)
- Admin notifications for order confirmations
