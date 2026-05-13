import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export type ApiQuest = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  deadline: string | null;
  visibility: "public" | "private";
  join_code?: string;
  max_points: number;
  participants_count: number;
  submissions_count: number;
  rules?: { id: string; rule: string }[];
  host?: { name: string; avatar_emoji: string };
};
export const useQuests = (search?: string) => {
  return useQuery({
    queryKey: ['quests', search],
    queryFn: async () => {
      const response = await apiClient.get<ApiQuest[]>('/quests', {
        params: { search }
      });
      return response.data;
    },
  });
};

export const useQuest = (id: string) => {
  return useQuery({
    queryKey: ['quest', id],
    queryFn: async () => {
      const response = await apiClient.get<ApiQuest>(`/quests/${id}`);
      return response.data;
    },
  });
};
