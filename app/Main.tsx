'use client';
import MemoView from '@/components/MemoView/MemoView';
import useMemoStore from '@/store/memo';
import { useMount } from 'ahooks';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/navigation';
import useConfigStore from '@/store/config';
import SimpleMemoView from '../src/components/MemoView/SimpleMemoView';
import { PhotoProvider } from 'react-photo-view';
import useCountStore from '../src/store/count';

export default function Home() {
    const { memos = [], fetchInitData, fetchPagedData, databases } = useMemoStore();
    const { fetchTags, getCount } = useCountStore();
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
        getCount();
    });

    return (
        <PhotoProvider>
            <InfiniteScroll
                dataLength={memos?.length || 0}
                next={fetchPagedData}
                hasMore={databases.total > (memos?.length || 0)}
                loader={
                    <p className="text my-4 text-center text-muted-foreground">
                        <b>Loading...</b>
                    </p>
                }
                endMessage={
                    <p className="text my-4 text-center text-muted-foreground">
                        <b>---- 已加载 {memos.length} 条笔记 ----</b>
                    </p>
                }
                scrollThreshold={0.8}
            >
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                    {memos.map((memo) => (
                        memo ? (
                            isSimpleMode
                                ? <SimpleMemoView {...memo} key={memo.id} />
                                : <MemoView {...memo} key={memo.id} />
                        ) : null
                    ))}
                </div>
            </InfiniteScroll>
        </PhotoProvider>
    );
}
