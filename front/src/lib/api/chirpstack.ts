import { chirpstackClient } from './chirpstack-client';

/**
 * Types de base pour les entités ChirpStack
 */

export interface Application {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  serviceProfileId: string;
  payloadCodec?: string;
  payloadDecoderScript?: string;
  payloadEncoderScript?: string;
}

export interface Device {
  devEui: string;
  name: string;
  description?: string;
  applicationId: string;
  deviceProfileId: string;
  skipFcntCheck?: boolean;
  isDisabled?: boolean;
  tags?: Record<string, string>;
}

export interface Gateway {
  id: string;
  name: string;
  description?: string;
  networkServerId: string;
  organizationId: string;
  location?: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  tags?: Record<string, string>;
}

/**
 * Services API pour ChirpStack
 */

export const chirpstackApi = {
  // Applications
  applications: {
    list: async (organizationId?: string) => {
      const url = organizationId 
        ? `/applications?organizationId=${organizationId}`
        : '/applications';
      return chirpstackClient.get<{ result: Application[] }>(url);
    },
    
    get: async (id: string) => {
      return chirpstackClient.get<Application>(`/applications/${id}`);
    },
    
    create: async (application: Omit<Application, 'id'>) => {
      return chirpstackClient.post<Application>('/applications', application);
    },
    
    update: async (id: string, application: Partial<Application>) => {
      return chirpstackClient.put<Application>(`/applications/${id}`, application);
    },
    
    delete: async (id: string) => {
      return chirpstackClient.delete<void>(`/applications/${id}`);
    },
  },

  // Devices
  devices: {
    list: async (applicationId: string) => {
      return chirpstackClient.get<{ result: Device[] }>(
        `/devices?applicationId=${applicationId}`
      );
    },
    
    get: async (devEui: string) => {
      return chirpstackClient.get<Device>(`/devices/${devEui}`);
    },
    
    create: async (device: Device) => {
      return chirpstackClient.post<Device>('/devices', device);
    },
    
    update: async (devEui: string, device: Partial<Device>) => {
      return chirpstackClient.put<Device>(`/devices/${devEui}`, device);
    },
    
    delete: async (devEui: string) => {
      return chirpstackClient.delete<void>(`/devices/${devEui}`);
    },
    
    activate: async (devEui: string, activationData: any) => {
      return chirpstackClient.post(`/devices/${devEui}/activate`, activationData);
    },
    
    deactivate: async (devEui: string) => {
      return chirpstackClient.delete(`/devices/${devEui}/activation`);
    },
  },

  // Gateways
  gateways: {
    list: async (organizationId?: string) => {
      const url = organizationId
        ? `/gateways?organizationId=${organizationId}`
        : '/gateways';
      return chirpstackClient.get<{ result: Gateway[] }>(url);
    },
    
    get: async (id: string) => {
      return chirpstackClient.get<Gateway>(`/gateways/${id}`);
    },
    
    create: async (gateway: Omit<Gateway, 'id'>) => {
      return chirpstackClient.post<Gateway>('/gateways', gateway);
    },
    
    update: async (id: string, gateway: Partial<Gateway>) => {
      return chirpstackClient.put<Gateway>(`/gateways/${id}`, gateway);
    },
    
    delete: async (id: string) => {
      return chirpstackClient.delete<void>(`/gateways/${id}`);
    },
  },
};

