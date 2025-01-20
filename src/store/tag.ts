import { TagType } from '@/type';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import useCountStore from '@/store/count';
import useMemoStore from '@/store/memo';

interface TagStore {
  tags: TagType[];
  setTags: (tags: TagType[]) => void;
  fetchTags: () => void;
}

const useTagStore = create<TagStore>()(
  devtools(
      (set) => ({
        tags: [],
      setTags: (tags) => {
        const { memosByTag } = useCountStore.getState();
          const sortedTags = tags.sort((a, b) => (memosByTag.get(b.name) ?? 0) - (memosByTag.get(a.name) ?? 0));
          set({ tags: sortedTags ?? [] });
        },
      fetchTags: () => {
        const { memos } = useMemoStore.getState();
        const tagSet = new Set<string>();
        memos.forEach(memo => {
          memo.tags?.forEach(tag => {
            tagSet.add(tag.name);
          });
        });
        const tags = Array.from(tagSet).map((name, index) => ({
          id: `tag-${index}`,
          name,
          color: Math.floor(Math.random() * 16)
        }));
          set({ tags });
        }
    }),
    {
      name: 'tag',
    },
  ),
);

export default useTagStore;
