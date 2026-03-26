import api from './api';

export interface Team {
  id: number;
  name: string;
  description: string | null;
}

export const getTeams = async (): Promise<Team[]> => {
  const response = await api.get<Team[]>('/api/teams');
  return response.data;
};
