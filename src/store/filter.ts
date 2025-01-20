import { format } from 'date-fns';
import { create } from 'zustand';
import computed from 'zustand-middleware-computed';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Filter } from '../api/type';


export enum ImageFilter {
  HAS_IMAGE = 'HAS_IMAGE',
  NO_IMAGE = 'NO_IMAGE',
  NO_FilTER = 'NO_FilTER',
}
interface MemoStore {
  tagFilter: string[];
  timeFilter?: Date;
  textFilter?: string;
  // 筛选是否有图片
  imageFilter: ImageFilter;
  setHasImageFilter: (imageFilter: ImageFilter) => void;
  setTextFilter: (text?: string) => void;
  setTimeFilter: (time?: Date) => void;
  setFilter: (tags: string[]) => void;
  removeTagFilter: (tag: string) => void;
  clearFilter: () => void;
  setDesc: (desc: boolean | 'random') => void;
  desc: boolean|'random'
  
}
interface ComputedState {
  timeFilterText: string;
  filterParams?: object;
  // 是否存在筛选
  hasFilter: boolean;
}

const useFilterStore = create(
  persist(
    computed<MemoStore, ComputedState>(
      (set, get) => ({
        tagFilter: [],
        imageFilter: ImageFilter.NO_FilTER,
        setHasImageFilter: (imageFilter: ImageFilter) => {
          set({ imageFilter });
        },
        setFilter: (tagFilter) => {
          set({ tagFilter });
        },
        setDesc: (desc) => {
          set({ desc });
        },
        setTextFilter: (text) => {
          set({ textFilter: text });
        },
        setTimeFilter: (time) => {
          set({ timeFilter: time });
        },
        removeTagFilter: (tag) => {
          set({
            tagFilter: get().tagFilter.filter((item) => item !== tag),
          });
        },
        desc: true,
        clearFilter: () => {
          set({
            tagFilter: [],
            timeFilter: undefined,
            textFilter: undefined,
            imageFilter: ImageFilter.NO_FilTER,
            desc: true,
          });
        },
      }),
      {
        timeFilterText: (state) => {
          if (!state?.timeFilter) {
            return '';
          }
          return format(state.timeFilter, 'yyyy-MM-dd');
        },
        hasFilter: (state) => {
          return !!(
            state.tagFilter.length > 0 ||
            state.timeFilter ||
            state.textFilter ||
            state.imageFilter !== ImageFilter.NO_FilTER
          );
        },
        filterParams: (state) => {
          if (!state.hasFilter) {
            return undefined;
          }
          const conditions = [
            ...state.tagFilter.map((item) => ({
              field_name: 'tags',
              operator: 'contains',
              value: [item]
            })),
            state.textFilter && {
              field_name: 'content',
              operator: 'contains',
              value: [state.textFilter]
            },
            state.imageFilter !== ImageFilter.NO_FilTER && {
              field_name: 'images',
              operator: state.imageFilter === ImageFilter.HAS_IMAGE ? 'isNotEmpty' : 'isEmpty',
              value: []
            },
            state.timeFilter && {
              "field_name": "created_time",
              "operator": "is",
              "value": [state.timeFilter]
            }
          ].filter(Boolean) as Filter['conditions'];
          return conditions?.length ?? 0 > 0 ? {
            "conjunction": "and",
            "conditions": conditions
          } : undefined;
        }
      },
    ),
    {
      name: 'filter',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useFilterStore;
