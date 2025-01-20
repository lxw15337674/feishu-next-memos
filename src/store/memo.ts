import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { getMemoByIdAction, getMemosDataActions } from '../api/dbActions';
import useFilterStore from './filter';
import { Memo } from '@prisma/client';
import { Note } from '../api/type';

interface MemoStore {
  memos: Note[];
  databases: {
    has_more: boolean;
    items: Note[];
    total: number;
  };
  fetchInitData: () => Promise<void>;
  fetchPagedData: () => Promise<void>;
  removeMemo: (id: string) => number;
  updateMemo: (id: string) => void;
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
          total: 0,
        },
        // 删除某条数据
        removeMemo: (pageId: string) => {
          const index = get().memos.findIndex((item) => item.id === pageId);
          set((state) => { state.memos.splice(index, 1) });
          return index;
        },
        // 更新数据
        updateMemo: (id: string) => {
          getMemoByIdAction(id).then((data) => {
            set((state) => {
              const index = state.memos.findIndex((item) => item.id === id);
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
          const response = await getMemosDataActions({
            filter: useFilterStore.getState().filterParams,
            desc: !!useFilterStore.getState().desc
          });
          console.log(response);
          if (response) {
            const databases = {
              has_more: false,
              items: response.items ?? [],
              total: response.total ?? 0
            };
            set((state) => {
              state.databases = databases;
              state.memos = databases.items;
            });
          }
        },
        // 获取分页数据
        fetchPagedData: async () => {
          const sort = useFilterStore.getState().desc;
          const response = await getMemosDataActions({
            filter: useFilterStore.getState().filterParams,
            desc: !!sort
          });
          if (response) {
            const databases = {
              has_more: false,
              items: response.items ?? [],
              total: response.total ?? 0
            };
            set((state) => {
              state.databases = databases;
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