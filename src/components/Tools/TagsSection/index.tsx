"use client"
import useTagStore from '@/store/tag';
import TagItemContainer from './TagItemContainer';
import { ScrollArea } from '@/components/ui/scroll-area';

const TagsSection = () => {
  const { tags } = useTagStore();
  if (!tags.length) {
    return null;
  }
  return (
    <ScrollArea className=" py-2 px-3 bg-card rounded-lg border  text-card-foreground shadow-sm w-full">
      <div className="flex flex-row justify-start items-center w-full">
        <span className="text-sm leading-6 font-mono text-gray-400 select-none">
          标签
        </span>
      </div>
      {tags.map((t) => (
        <TagItemContainer key={t.id} tag={t} />
      ))}
    </ScrollArea>
  );
};

export default TagsSection;
