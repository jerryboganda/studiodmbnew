import api from './api';

export interface DiscoveryData {
  agent_picks: any[];
  high_intent: any[];
  recently_active: any[];
}

export const getDiscoveryData = async (): Promise<DiscoveryData> => {
  const response = await api.get('/discovery');
  return response.data.data;
};

export const searchMembers = async (params: { q?: string; age_min?: number; age_max?: number; religion?: string; profession?: string }) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  const response = await api.get(`/discovery/search?${queryParams.toString()}`);
  return response.data;
};
