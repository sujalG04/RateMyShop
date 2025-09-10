// import dotenv from "dotenv";

// dotenv.config();

const API_BASE_URL ='http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    this.setToken(data.token);
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
    this.setToken(data.token);
    return data;
  }

  async updatePassword(currentEmail, newPassword) {
    return this.request('/auth/password', {
      method: 'PUT',
      body: { currentEmail, newPassword },
    });
  }

  // added
  async resetPassword(currentEmail, newPassword) {
    return this.request('/auth/reset_password', {
      method: 'PUT',
      body: { currentEmail, newPassword },
    });
  }
  // end 

  // User methods
  async getUsers(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/users?${params}`);
  }

  async getUserById(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: userData,
    });
  }

  async getDashboardStats() {
    return this.request('/users/stats');
  }

  // Store methods
  async getStores(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/stores?${params}`);
  }

  async createStore(storeData) {
    return this.request('/stores', {
      method: 'POST',
      body: storeData,
    });
  }

  async getMyStores() {
    return this.request('/stores/my-stores');
  }

  async getStoreRatings(storeId) {
    return this.request(`/stores/${storeId}/ratings`);
  }

  // Rating methods
  async submitRating(storeId, rating) {
    return this.request('/ratings', {
      method: 'POST',
      body: { storeId, rating },
    });
  }

  async getMyRatings() {
    return this.request('/ratings/my-ratings');
  }

  logout() {
    this.setToken(null);
  }
}

export default new ApiClient();