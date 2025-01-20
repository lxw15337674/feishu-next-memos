import Main from './Main';
import SideBar from './SideBar';
import NewMemoEditor from './NewMemoEditor';
import { ShareCardDialog } from '@/components/ShareCard/ShareCardDialog';
import LeftSide from '@/components/LeftSide';
import MemoFilter from '@/components/MemoFilter';
import MobileHeader from '../src/components/MobileHeader';



export default async function Home() {
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
              <Main />
            </section>
          </div>
        </main>
      </div>
      <ShareCardDialog />
      <SideBar />
    </div>
  );
}