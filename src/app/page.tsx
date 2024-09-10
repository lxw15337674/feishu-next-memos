import { NotionAPI } from 'notion-client';
import Main from './Main';
import SideBar from './SideBar';
import NewMemoEditor from './NewMemoEditor';
import ShareCardDialog from '@/components/ShareCard/ShareCardDialog';
import MobileHeader from '@/components/MobileHeader';
import LeftSide from '@/components/LeftSide';
import MemoFilter from '@/components/MemoFilter';

export default async function Home() {
  // 这个地方不知道为什么，放到service action里面会build报错：
  // ./node_modules/.pnpm/p-queue@7.4.1/node_modules/p-queue/dist/index.js + 4 modules
  // Cannot get final name for export 'EventEmitter' of./ node_modules /.pnpm / eventemitter3@5.0.1 / node_modules / eventemitter3 / index.mjs
  // 所以只能放到这里
  const api = new NotionAPI({
    activeUser: process.env.NOTION_ACTIVE_USER,
    authToken: process.env.NOTION_TOKEN_V2,
  });
  const recordMap = await api.getPage(process.env.NOTION_DATABASE_ID!, {});
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
              <Main recordMap={recordMap} />
            </section>
          </div>
        </main>
      </div>
      <ShareCardDialog />
      <SideBar />
    </div>
  );
}