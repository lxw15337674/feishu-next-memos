import { create } from 'zustand';
import { MemosCount, Note, TagWithCount } from '../api/type';
import { getCountAction, getTagsWithCountAction } from '../api/dbActions';

interface MemoStore {
    tags: TagWithCount[];
    fetchTags: () => void;
    getCount: () => Promise<void>;
    memosCount: MemosCount;
}

const useCountStore = create<MemoStore>(
    (set) => ({ 
        tags: [],
        memosCount: {
            dailyStats: [],
            total: 0,
            daysCount: 0
        },
        fetchTags: () => {
            getTagsWithCountAction().then(tags => {
                set({ tags });
            });
        },
        getCount: async () => {
            const result = await getCountAction();
            set({ memosCount: result });
        }
    }),
);
export default useCountStore;
