'use client';
import React from 'react';
import Icon from '../Icon';
import useTagStore from '@/store/tag';
import useCountStore from '@/store/count';
import { Card } from '../ui/card';

const Count: React.FC = () => {
  const { tags } = useTagStore();
  const { memosByDaysMap, memos } = useCountStore();

  return (
    <Card className="w-full border  py-2 px-3 rounded-md space-y-0.5">
      <div className="mb-1 w-full flex flex-row justify-between items-center">
        <p className="text-sm font-medium text-muted-foreground">统计</p>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="w-full flex justify-start items-center">
          <Icon.CalendarDays className="w-4 h-auto mr-1" />
          <span className="block text-base sm:text-sm">天</span>
        </div>
        <span className="font-mono">{memosByDaysMap?.size ?? 0}</span>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="w-full flex justify-start items-center">
          <Icon.Library className="w-4 h-auto mr-1" />
          <span className="block text-base sm:text-sm">笔记</span>
        </div>
        {memos?.length ?? 0}
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="w-full flex justify-start items-center">
          <Icon.Hash className="w-4 h-auto mr-1" />
          <span className="block text-base sm:text-sm">标签</span>
        </div>
        <span className="font-mono">{tags?.length ?? 0}</span>
      </div>
    </Card>
  );
};

export default Count;
