import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar_emoji: string;
  level: number;
  xp: number;
  streak: number;
  total_points: number;
  quests_hosted_count: number;
  quests_joined_count: number;
  quests_hosted?: any[];
  quests_joined?: any[];
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await apiClient.get<UserProfile>('/users/me');
      return response.data;
    },
    // Only fetch if we have a token (this would be handled by auth logic later)
    retry: false,
  });
};
