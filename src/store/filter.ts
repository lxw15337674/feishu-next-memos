import { format } from 'date-fns';
import { create } from 'zustand';
import computed from 'zustand-middleware-computed';
import { createJSONStorage, persist } from 'zustand/middleware';


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
}
interface ComputedState {
  // memos: DatabaseObjectResponse[]
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
        clearFilter: () => {
          set({
            tagFilter: [],
            timeFilter: undefined,
            textFilter: undefined,
            imageFilter: ImageFilter.NO_FilTER
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

          const filter = [
            ...state.tagFilter.map((item) => ({
              property: 'tags',
              multi_select: {
                contains: item,
              },
            })),
            state.timeFilterText && {
              timestamp: 'created_time',
              created_time: {
                equals: state.timeFilterText,
              },
            },
            state.textFilter && {
              property: 'content',
              rich_text: {
                contains: state.textFilter,
              },
            },
            state.imageFilter !== ImageFilter.NO_FilTER && {
              property: 'images',
              rich_text: {
                [state.imageFilter === ImageFilter.HAS_IMAGE ? 'is_not_empty' : 'is_empty']: true,
              },
            },
          ].filter(Boolean); // Remove falsy values from the array
          return filter.length > 0 ? { and: filter } : undefined;
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
