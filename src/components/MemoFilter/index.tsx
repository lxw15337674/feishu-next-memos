'use client';
import classNames from 'classnames';
import Icon from '../Icon';
import useFilterStore, { ImageFilter } from '@/store/filter';
import { useDebounceFn, useUpdateEffect } from 'ahooks';
import useMemoStore from '@/store/memo';
import { Button } from '../ui/button';
import { FilterDropMenu } from './FilterDropMenu';
import FilterTag from './FilterTag';
import { SortMenu } from './SortMenu';

interface Props {
  className?: string;
}

const MemoFilter = (props: Props) => {
  const {
    tagFilter,
    timeFilterText,
    setTimeFilter,
    removeTagFilter,
    clearFilter,
    setHasImageFilter,
    imageFilter,
    textFilter,
    setTextFilter,
    hasFilter,
    desc
  } = useFilterStore();
  const { fetchInitData } = useMemoStore();
  const { run: debounceFetchData } = useDebounceFn(fetchInitData, {
    wait: 300,
  });
  useUpdateEffect(() => {
    debounceFetchData();
  }, [tagFilter, timeFilterText, textFilter, imageFilter, desc]);
  return (
    <div
      className={classNames(
        `mb-4 w-full flex flex-row   flex-wrap gap-2 text-sm leading-7 dark:text-gray-400`,
        props.className,
      )}
    >
      <SortMenu />
      <FilterDropMenu />
      {
        hasFilter && (<div className="flex justify-start items-center px-2 mr-2   text-gray-400">
          <Icon.Filter className="w-4 h-auto mr-1" />
          <div className='h-auto align-middle'>已有筛选</div>
        </div>
        )
      }
      {textFilter && (
        <FilterTag onClear={() => setTextFilter('')} >
          关键字 : {textFilter}
        </FilterTag>
      )}
      {timeFilterText && (
        <FilterTag onClear={() => setTimeFilter()}>
          日期 : {timeFilterText}
        </FilterTag>
      )}
      {
        imageFilter !== ImageFilter.NO_FilTER && (
          <FilterTag onClear={() => setHasImageFilter(ImageFilter.NO_FilTER)}>
            {
              imageFilter === ImageFilter.HAS_IMAGE ? '仅显示有图片' : '仅显示没有图片'
            }
          </FilterTag>
        )
      }
      {tagFilter.map((item) => (
        <FilterTag key={item} onClear={() => removeTagFilter(item)}>
          标签 : {item}
        </FilterTag>
      ))}
      <div className="ml-auto">
        <Button variant="outline" size="sm" className='px-6 mr-2 '
          disabled={!hasFilter}
          onClick={clearFilter}>重置</Button>
      </div>
    </div>
  );
};

export default MemoFilter;
