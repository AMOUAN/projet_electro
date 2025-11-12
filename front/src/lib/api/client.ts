import axios, { AxiosInstance } from 'axios';


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token d'authentification
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Intercepteur pour gérer les erreurs
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // if (error.response?.status === 401) {
        //   localStorage.removeItem('token');
        //   window.location.href = '/login';
        // }
        // Log détaillé pour le débogage
        if (error.response?.status === 404) {
          // console.error(`Endpoint not found: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
          // console.error('Make sure the backend is running and the endpoint exists');
        }
        return Promise.reject(error);
      }
    );
  }

  // Dashboard
  async getDashboardStats() {
    try {
      const { data } = await this.client.get('/dashboard/stats');
      return data;
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      // Retourner des données par défaut en cas d'erreur
      return {
        totalDevices: 0,
        activeDevices: 0,
        gateways: 0,
        activeGateways: 0,
        dataPoints: 0,
        uptime: 0,
      };
    }
  }

  async getRecentActivity(limit = 10) {
    try {
      const { data } = await this.client.get(`/dashboard/activity?limit=${limit}`);
      return data || [];
    } catch (error: any) {
      console.error('Error fetching recent activity:', error);
      // Retourner un tableau vide en cas d'erreur
      return [];
    }
  }

  // Companies
  async getCompanies() {
    const { data } = await this.client.get('/companies');
    return data;
  }

  async getCompany(id: string) {
    const { data } = await this.client.get(`/companies/${id}`);
    return data;
  }

  async createCompany(company: any) {
    const { data } = await this.client.post('/companies', company);
    return data;
  }

  async updateCompany(id: string, company: any) {
    const { data } = await this.client.patch(`/companies/${id}`, company);
    return data;
  }

  async deleteCompany(id: string) {
    await this.client.delete(`/companies/${id}`);
  }

  // Applications
  async getApplications() {
    const { data } = await this.client.get('/applications');
    return data;
  }

  async getApplication(id: string) {
    const { data } = await this.client.get(`/applications/${id}`);
    return data;
  }

  // Contracts
  async getContracts() {
    const { data } = await this.client.get('/contracts');
    return data;
  }

  async getContract(id: string) {
    const { data } = await this.client.get(`/contracts/${id}`);
    return data;
  }

  async createContract(contract: any) {
    const { data } = await this.client.post('/contracts', contract);
    return data;
  }

  async updateContract(id: string, contract: any) {
    const { data } = await this.client.patch(`/contracts/${id}`, contract);
    return data;
  }

  async deleteContract(id: string) {
    await this.client.delete(`/contracts/${id}`);
  }

  // Users
  async getUsers() {
    const { data } = await this.client.get('/users');
    return data;
  }

  async getUser(id: string) {
    const { data } = await this.client.get(`/users/${id}`);
    return data;
  }

  async updateUser(id: string, user: any) {
    const { data } = await this.client.patch(`/users/${id}`, user);
    return data;
  }

  async deleteUser(id: string) {
    await this.client.delete(`/users/${id}`);
  }

  async activateUser(id: string) {
    const { data } = await this.client.patch(`/users/${id}/activate`);
    return data;
  }

  async deactivateUser(id: string) {
    const { data } = await this.client.patch(`/users/${id}/deactivate`);
    return data;
  }

  // Network
  async getNetworkHealth() {
    const { data } = await this.client.get('/network/health');
    return data;
  }

  async getGatewayHealth() {
    const { data } = await this.client.get('/network/gateways/health');
    return data;
  }

  async getGateways() {
    const { data } = await this.client.get('/network/gateways');
    return data;
  }

  async getGatewayStats(id: string) {
    const { data } = await this.client.get(`/network/gateways/${id}/stats`);
    return data;
  }

  async getFrames(limit = 100) {
    const { data } = await this.client.get(`/network/frames?limit=${limit}`);
    return data;
  }

  async getCoverageAnalysis() {
    const { data } = await this.client.get('/network/coverage');
    return data;
  }

  // Roles
  async getRoles() {
    const { data } = await this.client.get('/roles');
    return data;
  }

  // API Keys
  async getApiKeys() {
    const { data } = await this.client.get('/api-keys');
    return data;
  }

  async createApiKey(name: string) {
    const { data } = await this.client.post('/api-keys', { name });
    return data;
  }

  async deleteApiKey(id: string) {
    await this.client.delete(`/api-keys/${id}`);
  }

  // Settings
  async getSettings() {
    const { data } = await this.client.get('/settings');
    return data;
  }

  async updateSettings(settings: Record<string, string>) {
    const { data } = await this.client.post('/settings', settings);
    return data;
  }

  // Auth
  async login(credentials: { email: string; password: string }) {
    const { data } = await this.client.post('/auth/login', credentials);
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  }

  async requestAccess(request: any) {
    try {
      const { data } = await this.client.post('/users/request-access', request);
      return data;
    } catch (error: any) {
      console.error('Error requesting access:', error);
      throw error;
    }
  }

  async activateAccount(token: string, password: string, confirmPassword: string) {
    try {
      const { data } = await this.client.post('/users/activate', {
        token,
        password,
        confirmPassword,
      });
      return data;
    } catch (error: any) {
      console.error('Error activating account:', error);
      throw error;
    }
  }

  // Notifications
  async getNotifications() {
    const { data } = await this.client.get('/notifications');
    return data;
  }

  async getUnreadNotifications() {
    const { data } = await this.client.get('/notifications/unread');
    return data;
  }

  async getUnreadNotificationsCount() {
    const { data } = await this.client.get('/notifications/unread/count');
    return data.count;
  }

  async markNotificationAsRead(id: string) {
    const { data } = await this.client.patch(`/notifications/${id}/read`);
    return data;
  }

  async markAllNotificationsAsRead() {
    const { data } = await this.client.patch('/notifications/read-all');
    return data;
  }

  async deleteNotification(id: string) {
    await this.client.delete(`/notifications/${id}`);
  }

  // Password Reset
  async forgotPassword(email: string) {
    try {
      const { data } = await this.client.post('/auth/forgot-password', { email });
      return data;
    } catch (error: any) {
      console.error('Error sending forgot password email:', error);
      throw error;
    }
  }

  async validateResetToken(token: string) {
    try {
      const { data } = await this.client.get(`/auth/validate-reset-token/${token}`);
      return data;
    } catch (error: any) {
      console.error('Error validating reset token:', error);
      throw error;
    }
  }

  async resetPassword({ token, password }: { token: string; password: string }) {
    try {
      const { data } = await this.client.post('/auth/reset-password', {
        token,
        password,
      });
      return data;
    } catch (error: any) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();

