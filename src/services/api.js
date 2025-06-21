// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://faaf-hack-backend.onrender.com/';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Search vendors function
export const searchVendors = async (query, location) => {
  try {
    const response = await apiClient.post('/search', {
      query: query.trim(),
      location: location.trim(),
    });
    
    return response.data.results || [];
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      throw new Error(`Server error: ${error.response.data.detail || error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check if the backend is running.');
    } else {
      // Something else happened
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

// Health check function
export const checkServerHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Server is not responding');
  }
};

export default apiClient;