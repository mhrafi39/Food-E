const API_URL = 'http://localhost:5116/api';

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
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return { success: true, data };
  } catch (error) {
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
};

export default api;
