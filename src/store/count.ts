import { format } from 'date-fns';
import { create } from 'zustand';
import computed from 'zustand-middleware-computed';
import { Memo } from '../api/type';
import {  getAllMemosActions } from '../api/larkActions';

interface MemoStore {
    allMemos: Memo[];
    getAllMemos: () => Promise<void>;
}

interface ComputedState {
    memosByDaysMap: Map<string, string[]>;
    memosByTag: Map<string, number>;
}

const useCountStore = create(
    computed<MemoStore, ComputedState>(
        (set) => ({
            allMemos: [],
            getAllMemos: async () => {
                const data = await getAllMemosActions()
                set({ allMemos: data });
            }
        }),
        {
            memosByDaysMap: (state) => {
                return state.allMemos.reduce((acc, memo) => {
                    if (!memo.fields.created_time) return acc;
                    const day = format(memo.fields.created_time, 'yyyy/MM/dd');
                    acc.set(day, (acc.get(day) || []).concat(memo.record_id));
                    return acc;
                }, new Map<string, string[]>());
            },
            memosByTag: (state) => {
                const tagMap = new Map<string, number>();
                state.allMemos.forEach((memo) => {
                    const tags = memo.fields.tags;
                    if (tags) {
                        tags.forEach((tag) => {
                            tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
                        });
                    }
                });
                return tagMap;
            },
        },
    ),
);
export default useCountStore;
