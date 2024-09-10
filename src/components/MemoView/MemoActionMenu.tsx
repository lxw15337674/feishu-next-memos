import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '../Icon';
import { archivePage } from '@/api/actions';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import useMemoStore from '@/store/memo';
import { Button } from '../ui/button';
import { Content } from '@/utils/parser';
import useShareCardStore from '@/store/shareCard';
import useConfigStore from '@/store/config';

interface Props {
  memoId: string;
  onEdit: () => void;
  parsedContent: Content[][]
}

const MemoActionMenu = (props: Props) => {
  const { memoId, onEdit, parsedContent } = props;
  const { openShareCord } = useShareCardStore()
  const { hasEditCodePermission } = useConfigStore()
  const { toast } = useToast();
  const { removeMemo, insertMemo } = useMemoStore();
  const handleDeleteMemoClick = async () => {
    await archivePage(memoId, true);
    removeMemo(memoId);
    toast({
      title: '已删除',
      description: '已将笔记归档',
      action: (
        <ToastAction
          altText="撤回"
          onClick={async () => {
            const memo = await archivePage(memoId, false);
            if (memo) {
              insertMemo(memo);
            }
            toast({
              title: '已撤回',
              description: '已将笔记撤回',
            });
          }}
        >
          撤回
        </ToastAction>
      ),
    });
  };
  const handleEditMemoClick = () => {
    onEdit?.()
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon"
          >
            <Icon.MoreVertical
              className="w-4 h-4 mx-auto text-gray-500 dark:text-gray-400"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => openShareCord(parsedContent)}
          >
            生成分享图
          </DropdownMenuItem>
          {
            hasEditCodePermission && <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleEditMemoClick}
              >
                编辑
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer text-red-500 dark:text-red-400"
                onClick={handleDeleteMemoClick}
              >
                删除
              </DropdownMenuItem></>
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MemoActionMenu;
