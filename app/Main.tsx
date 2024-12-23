'use client';
import MemoView from '@/components/MemoView/MemoView';
import useMemoStore from '@/store/memo';
import useTagStore from '@/store/tag';
import { useMount } from 'ahooks';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/navigation';
import useConfigStore from '@/store/config';
import useCountStore from '../src/store/count';
import { Memo } from '../src/api/type';
import SimpleMemoView from '../src/components/MemoView/SimpleMemoView';
import useFilterStore from '../src/store/filter';
import { shuffleArray } from '../src/utils';


export default function Home({ allMemos = [] }: { allMemos: Memo[] }) {
    const { memos, fetchInitData, fetchPagedData, databases } = useMemoStore();
    const { desc, hasFilter } = useFilterStore()
    const { fetchTags } = useTagStore();
    const { setAllMemos } = useCountStore()
    const { validateAccessCode, config } = useConfigStore();
    const { isSimpleMode } = config.generalConfig;
    const router = useRouter();
    useMount(() => {
        validateAccessCode().then((hasAccessCodePermission) => {
            if (!hasAccessCodePermission) {
                router.push('/login')
            }
        });
        fetchInitData();
        fetchTags();
        setAllMemos(allMemos);
    });
    let currentMemos = memos
    if (desc === 'random' && !hasFilter) {
        currentMemos = shuffleArray(allMemos.slice(0, 300))
    }
    return (
        <InfiniteScroll
            dataLength={currentMemos?.length}
            next={fetchPagedData}
            hasMore={desc !== 'random' && (databases?.has_more ?? false)}
            loader={
                <p className=" text my-4 text-center text-muted-foreground">
                    <b>Loading...</b>
                </p>
            }
            endMessage={
                <p className=" text my-4 text-center text-muted-foreground">
                    <b>---- 已加载 {currentMemos.length} 条笔记 ----</b>
                </p>
            }
        >
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                {currentMemos.map((memo) => (
                    isSimpleMode
                        ? <SimpleMemoView key={memo.record_id} id={memo.record_id} {...memo.fields} />
                        : <MemoView key={memo.record_id} id={memo.record_id} {...memo.fields} />
                ))}
            </div>
        </InfiniteScroll>
    );
}
