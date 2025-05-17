// API utility for making backend requests
import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

// Create axios instance with default config
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to handle auth
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// API service functions
export const apiService = {
  // User related endpoints
  user: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: (userId) => api.get(`/users/id/${userId}`),
    updateProfile: (userId, userData) => api.put(`/users/${userId}`, userData),
  },
  
  // Product related endpoints
  product: {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    getByCategory: (categoryId, page = 0, size = 10) => 
      api.get(`/products/category/${categoryId}?page=${page}&size=${size}`),
    search: (params) => api.get('/products/search', { params }),
    create: (productData) => api.post('/products', productData),
    update: (id, productData) => api.put(`/products/${id}`, productData),
    delete: (id) => api.delete(`/products/${id}`),
  },
  
  // Cart related endpoints
  cart: {
    getActiveCart: (userId) => api.get(`/carts/user/id/${userId}/active`),
    getOrCreateCart: (email) => api.get(`/carts/user/${email}/get-or-create`),
    addProduct: (cartId, productId, quantity) => 
      api.post(`/carts/${cartId}/products/${productId}?quantity=${quantity}`),
    updateQuantity: (cartId, productId, quantity) => 
      api.put(`/carts/${cartId}/products/${productId}?quantity=${quantity}`),
    removeProduct: (cartId, productId) => 
      api.delete(`/carts/${cartId}/products/${productId}`),
    clearCart: (cartId) => api.delete(`/carts/${cartId}/clear`),
  },
  
  // Order related endpoints
  order: {
    getByUser: (email) => api.get(`/orders/user/${email}`),
    createFromCart: (cartId, shippingDetails) => 
      api.post(`/orders/cart/${cartId}`, null, { params: shippingDetails }),
    getById: (id) => api.get(`/orders/${id}`),
    processPayment: (orderId, paymentMethod, transactionId) => 
      api.post(`/orders/${orderId}/payment?paymentMethod=${paymentMethod}&transactionId=${transactionId}`),
  },
  
  // Category related endpoints
  category: {
    getAll: () => api.get('/categories'),
    getAllActive: () => api.get('/categories/active'),
    getById: (id) => api.get(`/categories/${id}`),
  },
}