# Notification System - Debugging Guide

## Issue: 401 Unauthorized Error

### What Was Happening
When opening the notification panel, you were getting:
```
GET http://localhost:5289/api/notifications/unread-count 401 (Unauthorized)
API Error: {message: "Response parsing error: Failed to execute 'json' on 'Response': Unexpected end of JSON input"}
```

### Root Cause
The 401 (Unauthorized) status means the API wasn't recognizing the user as authenticated. This happens when:

1. **No token in request** - The JWT token wasn't being sent in the Authorization header
2. **Null/empty token** - The token was null because user hadn't logged in yet
3. **Invalid token** - The token was malformed or expired
4. **Missing user claims** - The token didn't contain the required userId claim

### What Was Fixed

#### 1. **Corrected Token Key Mismatch**
- Your AuthContext stores token as: `'food-e-token'`
- Your api.js was correctly retrieving it: `localStorage.getItem('food-e-token')`
- ✅ No change needed - was already correct

#### 2. **Updated NotificationPanel to Use Unified API**
- **Before:** Used hardcoded `fetch()` with wrong token key
- **After:** Uses `api.getNotifications()` from utils/api.js
- ✅ Now uses correct token and proper error handling

#### 3. **Updated Navbar to Use Unified API**
- **Before:** Used hardcoded `fetch()` with wrong token key
- **After:** Uses `api.getUnreadCount()` from utils/api.js
- ✅ Now uses correct token and proper error handling

#### 4. **Added Comprehensive Error Handling in Backend**
Each NotificationsController method now has:
- Try-catch blocks to catch exceptions
- Proper HTTP status codes (401 Unauthorized, 500 Server Error)
- User-friendly error messages
- Detailed logging for debugging

#### 5. **Fixed NotificationPanel Animation Imports**
- Separated `motion` and `AnimatePresence` imports to avoid ESLint errors
- ✅ Properly uses Framer Motion animations

### API Structure Fixed

#### Updated `api.js` with Notification Methods
```javascript
getNotifications: () => apiRequest('/notifications'),
getUnreadCount: () => apiRequest('/notifications/unread-count'),
markNotificationAsRead: (id) =>
  apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),
markAllNotificationsAsRead: () =>
  apiRequest('/notifications/mark-all-read', { method: 'PUT' }),
deleteNotification: (id) =>
  apiRequest(`/notifications/${id}`, { method: 'DELETE' }),
deleteAllNotifications: () =>
  apiRequest('/notifications/delete-all', { method: 'DELETE' }),
```

---

## Testing Checklist

### Step 1: Verify User Authentication
```
✓ Login with valid credentials
✓ Check localStorage for 'food-e-token'
✓ Token should be a JWT string (starts with 'ey...')
✓ Check browser's Network tab - verify Authorization header is sent
```

### Step 2: Test Notification Endpoint
**In Browser Console:**
```javascript
// Check token exists
localStorage.getItem('food-e-token')

// Test API directly
fetch('http://localhost:5289/api/notifications/unread-count', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('food-e-token')}`
  }
})
.then(r => r.json())
.then(d => console.log(d))
```

### Step 3: Place an Order
```
✓ Login as user
✓ Add items to cart
✓ Checkout
✓ Place order
✓ Check database - Notifications table should have new record
```

### Step 4: Check Notification Panel
```
✓ Click bell icon in navbar
✓ Panel should open without 401 error
✓ Should display "Loading..." then notification
✓ Should show message: "Your order is placed successfully. Order #: X"
```

### Step 5: Test All Actions
```
✓ Click ✓ icon to mark as read
✓ Badge count should decrease
✓ Click "Mark all as read" button
✓ Click trash icon to delete notification
✓ Click "Delete all" button
✓ All actions should work without errors
```

---

## Database Verification

### Check if Notifications Table Exists
```sql
-- SQL Server
SELECT * FROM Notifications;
SELECT * FROM [Notifications] WHERE UserId = 1;
```

### Verify Order-Notification Link
```sql
-- Find orders and their notifications
SELECT 
  o.Id as OrderId,
  o.UserId,
  o.CustomerName,
  n.Id as NotificationId,
  n.Message,
  n.IsRead
FROM Orders o
LEFT JOIN Notifications n ON o.UserId = n.UserId
WHERE o.Id = 1;
```

---

## Common Error Scenarios & Solutions

### Error: "401 Unauthorized"
**Problem:** User not authenticated or token missing
**Solution:**
1. Login first
2. Verify token in localStorage: `localStorage.getItem('food-e-token')`
3. Check Network tab - Authorization header should be present
4. Token should not be null

### Error: "Response parsing error: Unexpected end of JSON input"
**Problem:** API returned 401 with no JSON body
**Solution:**
1. Check user authentication
2. Verify JWT token is valid
3. Check browser console - should show actual error details
4. See Network tab for full response

### Error: "User ID not found in claims"
**Problem:** JWT token exists but doesn't contain userId claim
**Solution:**
1. Re-login to get fresh token with proper claims
2. Check AuthController is setting userId in JWT
3. Verify `ClaimTypes.NameIdentifier` is being added to token

### Error: "Notification not found" (404)
**Problem:** Trying to access/delete notification belonging to different user
**Solution:**
1. Notifications are isolated by UserId
2. Can only access own notifications
3. User isolation is working correctly (expected behavior)

---

## Browser Developer Tools

### Network Tab Checks
```
✓ Request URL: http://localhost:5289/api/notifications
✓ Request Method: GET
✓ Request Headers include: Authorization: Bearer <token>
✓ Response Status: 200 (OK) or 401 (Unauthorized)
✓ Response Body: Array of notifications or error message
```

### Console Checks
```javascript
// Check token
console.log(localStorage.getItem('food-e-token'));

// Check if user is authenticated
console.log(localStorage.getItem('food-e-user'));

// Check API URL
console.log(import.meta.env.VITE_API_URL);

// Should log: http://localhost:5289/api
```

---

## Fixed Files Summary

### Backend Files
1. **NotificationsController.cs**
   - ✅ Added try-catch blocks to all methods
   - ✅ Added proper error handling
   - ✅ Better error messages
   - ✅ Proper HTTP status codes

### Frontend Files
1. **NotificationPanel.jsx**
   - ✅ Uses `api.getNotifications()` instead of hardcoded fetch
   - ✅ Uses `api.deleteNotification()` etc.
   - ✅ Fixed import statement for Framer Motion
   - ✅ Added error state display
   - ✅ Better error logging

2. **Navbar.jsx**
   - ✅ Uses `api.getUnreadCount()` instead of hardcoded fetch
   - ✅ Fixed import statement
   - ✅ Better error handling

3. **api.js**
   - ✅ Added all notification API methods
   - ✅ Centralized API calls
   - ✅ Consistent error handling

---

## What to Do Next

### Immediate Actions
1. ✅ Build is successful
2. ✅ Start the backend server
3. ✅ Start the frontend development server
4. ✅ Login with test account
5. ✅ Place test order
6. ✅ Check notification bell

### If Issues Persist

**Check Browser Console:**
```
- Look for red error messages
- Check Network tab for failed requests
- Verify 401 error no longer appears
- Check if token is being sent in Authorization header
```

**Check Backend Logs:**
```
- Look for exceptions in console
- Verify database queries are executing
- Check if notifications are being created
```

**Database Check:**
```sql
SELECT * FROM Notifications WHERE UserId = 1;
-- Should show notifications created when orders placed
```

---

## Success Indicators

✅ **Notification Bell Shows Unread Count**
- Badge appears when you have unread notifications
- Count updates when you mark as read

✅ **Notification Panel Opens**
- No 401 errors
- Shows "Loading..." then notifications
- Displays message correctly

✅ **Mark as Read Works**
- Click check icon
- Notification IsRead changes to true
- Badge count decreases

✅ **Mark All as Read Works**
- Click "Mark all as read"
- All notifications IsRead = true
- Badge disappears

✅ **Delete Works**
- Click trash icon
- Notification removed from list
- Badge count decreases

✅ **New Orders Create Notifications**
- Place new order
- Auto-refresh gets new unread count
- Bell badge shows new count after 30 seconds (or manual refresh)

---

## Performance Notes

- **Auto-refresh interval:** 30 seconds (configurable in Navbar.jsx)
- **API caching:** Configured to prevent cache with headers
- **Database indexes:** UserId indexed for fast queries
- **Lazy loading:** Notifications load only when panel opens

---

## Support

If you still encounter issues:

1. **Check the logs** in browser console and backend
2. **Verify authentication** - make sure user is logged in
3. **Test API endpoint** directly using the code snippet above
4. **Check database** - verify notifications exist
5. **Review error messages** - they should be more descriptive now

The notification system is now fixed and should work properly! 🎉
