import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { chirpstackConfig } from '@/lib/config/chirpstack';

/**
 * Client API pour ChirpStack
 * Gère les requêtes vers l'API ChirpStack
 */
class ChirpStackClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: chirpstackConfig.apiUrl,
      timeout: chirpstackConfig.timeout,
      headers: chirpstackConfig.defaultHeaders,
    });

    // Intercepteur pour gérer les erreurs
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Gestion des erreurs
        return Promise.reject(error);
      }
    );
  }

  /**
   * Méthode générique pour les requêtes GET
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Méthode générique pour les requêtes POST
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Méthode générique pour les requêtes PUT
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Méthode générique pour les requêtes DELETE
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

}

// Instance singleton du client
export const chirpstackClient = new ChirpStackClient();

// Export des types d'erreur
export type ChirpStackError = AxiosError;

