import { getAllLabels } from '@/api/actions';
import { TagType } from '@/type';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface TagStore {
  tags: TagType[];
  fetchTags: () => Promise<void>;
  upsertTag: (tagName: string) => Promise<void>;
  batchUpsertTag: (tagNames: string[]) => Promise<void>;
  deleteTag: (tagName: string) => Promise<void>;
}

const useTagStore = create<TagStore>()(
  devtools(
    persist(
      (set) => ({
        tags: [],
        fetchTags: async () => {
          const tags = await getAllLabels();
          set({ tags: tags ?? [] });
        },
        upsertTag: async (tagName: string) => { },
        batchUpsertTag: async (tagNames: string[]) => { },
        deleteTag: async (tagName: string) => { },
      }),
      {
        name: 'memos-storage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
    {
      name: 'tag',
    },
  ),
);

export default useTagStore;
