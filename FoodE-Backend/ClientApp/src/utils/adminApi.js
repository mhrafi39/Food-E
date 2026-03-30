const API_URL = import.meta.env.VITE_API_URL;

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
      console.error('API Error Response:', data);

      // Log detailed validation errors
      if (data.errors) {
        console.error('Validation Errors:', data.errors);
        // Format validation errors for display
        const errorMessages = Object.entries(data.errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        throw new Error(errorMessages || data.title || `Request failed with status ${response.status}`);
      }

      throw new Error(data.message || data.title || `Request failed with status ${response.status}`);
    }

    return { success: true, data };                             
  } catch (error) {
    console.error('API Request Error:', error);
    return { success: false, error: error.message };    
  }
};

// Admin API methods
export const adminApi = {
  // Dashboard
  getDashboard: () => adminApiRequest('/Admin/dashboard/stats'),

  // Items Management   
  getAllItems: () => adminApiRequest('/Admin/fooditems'),
  createItem: (itemData) =>
    adminApiRequest('/Admin/fooditems', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),
  updateItem: (id, itemData) =>
    adminApiRequest(`/Admin/fooditems/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    }),
  deleteItem: (id) =>
    adminApiRequest(`/Admin/fooditems/${id}`, {
      method: 'DELETE',
    }),
  getItemWithRecipe: (id) => 
    adminApiRequest(`/Admin/fooditems/${id}`),
  getItemRecipeDetails: (id) =>
    adminApiRequest(`/Admin/fooditems/${id}/recipe-details`),
  prepareItems: (id, quantity) =>
    adminApiRequest(`/Admin/fooditems/${id}/prepare`, {
      method: 'POST',
      body: JSON.stringify({ Quantity: quantity }),
    }),

  // Orders Management
  getAllOrders: () => adminApiRequest('/Admin/orders'),
  updateOrderStatus: (id, status) =>
    adminApiRequest(`/Admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ Status: status }),
    }),

  // Customers
  getAllCustomers: () => adminApiRequest('/Admin/users'),

  // Raw Materials Management
  getAllMaterials: () => adminApiRequest('/RawMaterials'),
  getMaterial: (id) => adminApiRequest(`/RawMaterials/${id}`),
  createMaterial: (materialData) =>
    adminApiRequest('/RawMaterials', {
      method: 'POST',
      body: JSON.stringify(materialData),
    }),
  updateMaterial: (id, materialData) =>
    adminApiRequest(`/RawMaterials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(materialData),
    }),
  deleteMaterial: (id) =>
    adminApiRequest(`/RawMaterials/${id}`, {
      method: 'DELETE',
    }),
  recordPurchase: (purchaseData) =>
    adminApiRequest('/RawMaterials/purchase', {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    }),
  getPurchaseHistory: (materialId) =>
    adminApiRequest(`/RawMaterials/${materialId}/purchase-history`),

  // Recipe Management
  getAllRecipes: () => adminApiRequest('/Recipes'),
  getRecipeByFoodItem: (foodItemId) =>
    adminApiRequest(`/Recipes/fooditem/${foodItemId}`),
  createRecipe: (recipeData) =>
    adminApiRequest('/Recipes', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    }),
  updateRecipe: (id, recipeData) =>
    adminApiRequest(`/Recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recipeData),
    }),
  deleteRecipe: (id) =>
    adminApiRequest(`/Recipes/${id}`, {
      method: 'DELETE',
    }),

  // Profit Analytics
  getDailyProfit: (date) =>
    adminApiRequest(`/Admin/profit/daily${date ? `?date=${date}` : ''}`),
  getWeeklyProfit: () => adminApiRequest('/Admin/profit/weekly'),
  getMaterialsUsage: (startDate, endDate) =>
    adminApiRequest(
      `/Admin/profit/materials-usage?startDate=${startDate}&endDate=${endDate}`
    ),
};

export default adminApi;
