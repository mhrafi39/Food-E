// Utility function to normalize order data from backend
// Handles both camelCase and PascalCase responses

export const normalizeOrderData = (order) => {
  if (!order) return null;

  // Helper to get property with fallbacks
  const getProp = (camelKey, pascalKey) => {
    return order[camelKey] ?? order[pascalKey] ?? null;
  };

  // Normalize items array
  const rawItems = order.items || order.Items || order.orderItems || order.OrderItems || [];
  const normalizedItems = rawItems.map(item => ({
    name: item.name || item.Name || item.foodItemName || item.FoodItemName || 'Unknown',
    quantity: item.quantity ?? item.Quantity ?? 0,
    price: item.price ?? item.Price ?? 0,
    totalPrice: item.totalPrice ?? item.TotalPrice ?? ((item.price ?? item.Price ?? 0) * (item.quantity ?? item.Quantity ?? 0))
  }));

  return {
    id: getProp('id', 'Id'),
    customerName: getProp('customerName', 'CustomerName'),
    customerEmail: getProp('customerEmail', 'CustomerEmail') || getProp('email', 'Email'),
    customerPhone: getProp('customerPhone', 'CustomerPhone') || getProp('phone', 'Phone'),
    deliveryAddress: getProp('deliveryAddress', 'DeliveryAddress') || getProp('address', 'Address'),
    notes: getProp('notes', 'Notes'),
    paymentMethod: getProp('paymentMethod', 'PaymentMethod'),
    totalAmount: getProp('totalAmount', 'TotalAmount') ?? 0,
    status: getProp('status', 'Status') || 'Unknown',
    orderDate: getProp('orderDate', 'OrderDate'),
    items: normalizedItems
  };
};

export const normalizeOrdersData = (orders) => {
  if (!Array.isArray(orders)) return [];
  return orders.map(normalizeOrderData).filter(o => o !== null);
};

export default {
  normalizeOrderData,
  normalizeOrdersData
};
