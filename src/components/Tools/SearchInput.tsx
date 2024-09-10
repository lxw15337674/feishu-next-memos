'use client'
import useFilterStore from '@/store/filter';
import Icon from '../Icon';
import { Input } from '@mui/joy';
import { useDebounceFn, useKeyPress } from 'ahooks';
import { useRef } from 'react';

export function SearchInput() {
  const { setTextFilter } = useFilterStore();
  const ref = useRef<HTMLDivElement>(null);
  const { run: debounceSetFilter } = useDebounceFn(setTextFilter, {
    wait: 500,
  });
  useKeyPress('ctrl.k', (e) => {
    e.preventDefault();
    e.stopPropagation();
    ref?.current?.querySelector('input')?.focus();
  });

  return (
    <Input
      startDecorator={<Icon.Search size={16} />}
      placeholder="搜索笔记 Ctrl+K"
      className="bg-card"
      ref={ref}
      onChange={(e) => {
        debounceSetFilter((e.target as HTMLInputElement).value);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          // 当按下 Enter 键时触发
          debounceSetFilter((e.target as HTMLInputElement).value);
        }
      }}
      onBlur={(e) => {
        e.target.value = '';
      }}
    />
  );
}
