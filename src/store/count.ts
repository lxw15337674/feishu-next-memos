import { format } from 'date-fns';
import {
  Block,
  CollectionPropertySchema,
  CollectionPropertySchemaMap,
  ExtendedRecordMap,
  SelectOption,
} from 'notion-types';
import { create } from 'zustand';
import computed from 'zustand-middleware-computed';
import { devtools } from 'zustand/middleware';

interface MemoStore {
  recordMap: ExtendedRecordMap | null;
  setRecordMap: (recordMap: ExtendedRecordMap) => void;
}
type Property = CollectionPropertySchema & { id: string };

interface ComputedState {
  memos: Block[]; // Update the type of memos property
  memosByDaysMap: Map<string, string[]>;
  schema: CollectionPropertySchemaMap;
  contentSchema: Property | undefined;
  tagSchema: Property | undefined;
  allTags: SelectOption[];
  memosByTag: Map<string, number>;
}

const useCountStore = create(
  devtools(
    computed<MemoStore, ComputedState>(
      (set) => ({
        recordMap: null,
        setRecordMap: (recordMap: ExtendedRecordMap) => {
          set({ recordMap });
        },
      }),
      {
        memos: (state) => {
          if (state.recordMap) {
            return Object.values(state.recordMap.block)
              .slice(2)
              .filter((block) => {
                return block.value.type === 'page';
              })
              .map((block) => block.value);
          }
          return [];
        },
        memosByDaysMap: (state) => {
          return state.memos.reduce((acc, memo) => {
            const day = format(memo.created_time, 'yyyy/MM/dd');
            acc.set(day, (acc.get(day) || []).concat(memo.id));
            return acc;
          }, new Map<string, string[]>());
        },
        allTags: (state) => {
          return state.tagSchema?.options ?? [];
        },
        schema: (state) => {
          if (
            !state.recordMap ||
            !Object.values(state.recordMap.collection).length
          ) {
            return {};
          }
          return Object.values(state.recordMap.collection)[0].value
            .schema as CollectionPropertySchemaMap;
        },
        contentSchema: (state) => {
          const item = Object.entries(state.schema).find(
            ([key, value]) => value.name === 'content',
          );
          return item ? { id: item[0], ...item[1] } : undefined;
        },
        tagSchema: (state) => {
          const item = Object.entries(state.schema).find(
            ([key, value]) => value.name === 'tags',
          );
          return item ? { id: item[0], ...item[1] } : undefined;
        },
        memosByTag: (state) => {
          const tagSchema = state.tagSchema;
          if (!tagSchema) {
            return new Map();
          }
          const tagId = tagSchema.id;
          const tagMap = new Map<string, number>();
          state.memos.forEach((memo) => {
            const tags = (memo.properties?.[tagId]?.[0]?.[0]?.split(',') ??
              []) as string[];
            if (tags.length) {
              tags.forEach((tag) => {
                if (!tagMap.has(tag)) {
                  tagMap.set(tag, 0);
                }
                tagMap.set(tag, tagMap.get(tag)! + 1);
              });
            }
          });

          return tagMap;
        },
      },
    ),
    {
      name: 'count',
    },
  ),
);

export default useCountStore;
