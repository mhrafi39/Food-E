const API_URL = import.meta.env.VITE_API_URL;

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('food-e-token');
};

// Make authenticated API request
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      data = { message: `Response parsing error: ${jsonError.message}` };
    }

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.message || data.details || data.title || 'Request failed');
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Request Failed:', error);
    return { success: false, error: error.message };
  }
};

// Specific API methods
export const api = {
  // Food Items
  getFoodItems: () => apiRequest('/fooditems'),
  getFoodItem: (id) => apiRequest(`/fooditems/${id}`),
  getFoodByCategory: (category) => apiRequest(`/fooditems/category/${category}`),
  getDeals: () => apiRequest('/fooditems/deals'),

  // Orders (authenticated)
  getOrders: () => apiRequest('/orders'),
  getOrder: (id) => apiRequest(`/orders/${id}`),
  createOrder: (orderData) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  updateOrderStatus: (id, status) =>
    apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(status),
    }),
  cancelOrder: (id) =>
    apiRequest(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'Cancelled' }),
    }),
};

export default api;
