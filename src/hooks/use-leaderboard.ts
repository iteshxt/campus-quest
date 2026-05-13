import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export type LeaderboardEntry = {
  rank: number;
  name: string;
  handle: string;
  avatar_emoji: string;
  level: number;
  total_points: number;
  streak: number;
};

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const response = await apiClient.get<LeaderboardEntry[]>('/leaderboard');
      return response.data;
    },
  });
};
