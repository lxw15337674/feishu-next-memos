import { TagType } from '@/type';
import Tag from '@/components/Tag';
import useCountStore from '@/store/count';
import useFilterStore from '@/store/filter';
import { useMemo } from 'react';
import useTagStore from '../../../store/tag';

interface Props {
  tag: TagType;
}

export const TagItemContainer = ({ tag }: Props) => {
  const { memosByTag } = useCountStore();
  const { tagFilter, setFilter, removeTagFilter } = useFilterStore();
  const isActive = useMemo(() => {
    return tagFilter.includes(tag.name);
  }, [tagFilter, tag]);

  const handleTagClick = () => {
    if (isActive) {
      removeTagFilter(tag.name);
    } else {
      setFilter([...tagFilter, tag.name]);
    }
  };
  return (
    <div
      className="relative flex flex-row justify-between items-center  leading-6 py-0.5 rounded-lg text-sm select-none  cursor-pointer w-full"
      onClick={handleTagClick}
    >
      <div
        className={`flex flex-row justify-start items-center
                    px-2 py-2 rounded
                    truncate shrink leading-5   w-[11rem]
                    ${isActive ? 'bg-green-600  dark:bg-green-600 text-white dark:text-white active' : '  hover:bg-zinc-100 dark:hover:bg-zinc-700'}
                        `}
      >
        <Tag className="truncate " text={tag.name}>
          {tag.name}
        </Tag>
        <div className="ml-auto">{memosByTag?.get?.(tag.name) || 0}</div>
      </div>
    </div>
  );
};

export default TagItemContainer;
