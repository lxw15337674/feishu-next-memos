import { getDBData } from '@/api/actions';
import {
  DatabaseObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import useFilterStore from './filter';
import { immer } from 'zustand/middleware/immer';

interface MemoStore {
  memos: DatabaseObjectResponse[];
  databases: QueryDatabaseResponse;
  fetchInitData: () => Promise<void>;
  fetchPagedData: () => Promise<void>;
  removeMemo: (pageId: string) => number;
  insertMemo: (page: DatabaseObjectResponse) => void;
  updateMemo: (page: DatabaseObjectResponse) => void;
}

const useMemoStore = create<MemoStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        memos: [],
        databases: {
          object: 'list',
          results: [],
          next_cursor: null,
          has_more: true,
          type: 'page_or_database',
          page_or_database: {},
          request_id: '',
        },
        // 删除某条数据
        removeMemo: (pageId: string) => {
          const index = get().memos.findIndex((item) => item.id === pageId);
          set((state) => {state.memos.splice(index, 1)});
          return index;
        },
        // 插入数据
        insertMemo: (page: DatabaseObjectResponse) => {
          set((state) => {
            state.memos.unshift(page)
          });
        },
        // 更新数据
        updateMemo: (page: DatabaseObjectResponse) => {
          set((state) => {
            const index = state.memos.findIndex((item: DatabaseObjectResponse) => item.id === page.id);
            if (index !== -1) {
              state.memos[index] = page;
            }
          });
        },
        // 获取初始化数据
        fetchInitData: async () => {
          const databases = await getDBData({
            filter: useFilterStore.getState().filterParams,
          });
          set({
            databases,
            memos: databases.results as DatabaseObjectResponse[],
          });
        },
        // 获取分页数据
        fetchPagedData: async () => {
          const startCursor = get().databases.next_cursor;
          if (startCursor) {
            const databases = await getDBData({
              startCursor,
              filter: useFilterStore.getState().filterParams,
            });
            set((state) => {
              state.databases = databases;
              state.memos.push(...(databases.results as DatabaseObjectResponse[]));
            });
          }
        },
      })),
      {
        name: 'memos-storage', // 存储名称
        storage: createJSONStorage(() => sessionStorage), // 使用sessionStorage存储
      }
    ),
    {
      name: 'memo', // devtools名称
    }
  )
);

export default useMemoStore;