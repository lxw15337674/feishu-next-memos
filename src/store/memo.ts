import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { getMemoByIdAction, getMemosDataActions } from '../api/larkActions';
import { Bitable, Memo } from '../api/type';
import useFilterStore from './filter';

interface MemoStore {
  memos: Memo[];
  databases: Bitable;
  fetchInitData: () => Promise<void>;
  fetchPagedData: () => Promise<void>;
  removeMemo: (record_id: string) => number;
  updateMemo: (record_id: string) => void;
  fetchFirstData: () => Promise<void>;
}

const useMemoStore = create<MemoStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        memos: [],
        databases: {
          has_more: false,
          items: [],
          page_token: '',
          total: 0,
        },
        // 删除某条数据
        removeMemo: (pageId: string) => {
          const index = get().memos.findIndex((item) => item.record_id === pageId);
          set((state) => { state.memos.splice(index, 1) });
          return index;
        },
        // 更新数据
        updateMemo: (record_id: string) => {
          getMemoByIdAction(record_id).then((data) => {
            set((state) => {
              const index = state.memos.findIndex((item) => item.record_id === record_id);
              if (index !== -1 && data) {
                state.memos[index] = data
              }
            });
          });
        },
        fetchFirstData: async () => {
          const databases = await getMemosDataActions();
          if (databases?.items) {
            set((state) => {
              state.memos.unshift(databases.items[0]);
            })
          }
        },
        // 获取初始化数据
        fetchInitData: async () => {
          const databases = await getMemosDataActions({
            filter: useFilterStore.getState().filterParams,
          });
          if (databases) {
            set({
              databases,
              memos: databases?.items ?? []
            })
          }
        },
        // 获取分页数据
        fetchPagedData: async () => {
          const page_token = get().databases.page_token;
          if (page_token) {
            const databases = await getMemosDataActions({
              page_token,
              filter: useFilterStore.getState().filterParams,
            });
            set((state) => {
              state.databases = databases
              state.memos.push(...databases.items);
            });
          }
        },
      })),
      {
        name: 'memos-storage', // 存储名称
        storage: createJSONStorage(() => localStorage),
      }
    ),
    {
      name: 'memo',
    }
  )
);

export default useMemoStore;