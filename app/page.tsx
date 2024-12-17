import Main from './Main';
import SideBar from './SideBar';
import NewMemoEditor from './NewMemoEditor';
import ShareCardDialog from '@/components/ShareCard/ShareCardDialog';
import LeftSide from '@/components/LeftSide';
import MemoFilter from '@/components/MemoFilter';
import { unstable_cache } from 'next/cache';
import { Memo } from '../src/api/type';
import { getRecordsActions } from '../src/api/larkActions';
import MobileHeader from '../src/components/MobileHeader';
import { shuffleArray } from '../src/utils';

const getCachedAllMemos = unstable_cache(
  async () => {
    const allMemos: Memo[] = [];
    let page_token: string | undefined = undefined;
    do {
      const data = await getRecordsActions({ page_token });
      allMemos.push(...data?.items ?? []);
      page_token = data?.page_token;
      await new Promise(resolve => setTimeout(resolve, 200)); 
    } while (page_token);
    console.log("所有数据获取成功");
    return allMemos;
  },
  ['memos'],
  { revalidate: 60 * 60 }
)

export default async function Home() {
  const allMemos = await getCachedAllMemos()
  return (
    <div className="flex flex-col md:flex-row max-w-[100vw] min-h-screen">
      <MobileHeader />
      <LeftSide />
      <div className="flex-1 md:ml-40 md:pl-6 px-4 overflow-hidden">
        <main className="flex flex-col h-full md:mr-60">
          <div className="w-full mt-4 flex flex-col flex-grow overflow-hidden">
            <div className="mb-4" id='edit'>
              <NewMemoEditor />
            </div>
            <MemoFilter />
            <section className="overflow-y-auto overflow-x-hidden flex-grow">
              <Main allMemos={allMemos} />
            </section>
          </div>
        </main>
      </div>
      <ShareCardDialog />
      <SideBar />
    </div>
  );
}