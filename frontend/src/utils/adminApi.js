const API_URL = 'http://localhost:5116/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('food-e-token');
};

// Make authenticated API request
export const adminApiRequest = async (endpoint, options = {}) => {
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

// Admin API methods
export const adminApi = {
  // Dashboard
  getDashboard: () => adminApiRequest('/admin/dashboard'),

  // Items Management
  getAllItems: () => adminApiRequest('/admin/items'),
  createItem: (itemData) =>
    adminApiRequest('/admin/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),
  updateItem: (id, itemData) =>
    adminApiRequest(`/admin/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    }),
  deleteItem: (id) =>
    adminApiRequest(`/admin/items/${id}`, {
      method: 'DELETE',
    }),

  // Orders Management
  getAllOrders: () => adminApiRequest('/admin/orders'),
  updateOrderStatus: (id, status) =>
    adminApiRequest(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(status),
    }),

  // Customers
  getAllCustomers: () => adminApiRequest('/admin/customers'),
};

export default adminApi;
