import { Content } from '@/utils/parser';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ShareCardStore {
    text: Content[][];
    open: boolean;
    openShareCord: (text: Content[][]) => void;
    setOpen: (open: boolean) => void;
}

const useShareCardStore = create<ShareCardStore>()(
    devtools(
        (set) => ({
            text: [],
            open: false,
            openShareCord: (text) => {
                set({ text, open: true });
            },
            setOpen: (open) => {
                set({ open });
            },
        }),
        {
            name: 'shareCardStore',
        },
    ),
);

export default useShareCardStore;
