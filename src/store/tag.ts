import { TagType } from '@/type';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { getAllFields } from '../api/larkActions';
import useCountStore from '@/store/count';

interface TagStore {
  tags: TagType[];
  fetchTags: () => Promise<void>;
  setTags: (tags: TagType[]) => void;
}

const useTagStore = create<TagStore>()(
  devtools(
    persist(
      (set) => ({
        tags: [],
        fetchTags: async () => {
          const allFields = await getAllFields();
          if (!allFields) return;
          const tags = allFields.items?.find(item => item.field_name === 'tags')?.property?.options as TagType[];
          const { memosByTag } = useCountStore.getState()
          const sortedTags = tags.sort((a, b) => (memosByTag.get(b.name) ?? 0) - (memosByTag.get(a.name) ?? 0));
          set({ tags: sortedTags ?? [] });
        },
        setTags: (tags) => {
          set({ tags });
        }
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
