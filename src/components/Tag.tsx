import useFilterStore from '@/store/filter';
import useMemoStore from '@/store/memo';
import { Children } from 'react';

interface Props {
  text: string;
  children?: React.ReactNode;
  className?: string;
}

const Tag = ({ text, className, children }: Props) => {
  const { setFilter } = useFilterStore();
  return (
    <span
      title={text}
      onClick={() => {
        setFilter([text]);
      }}
      className={`cursor-pointer hover:opacity-80 ${className}`}
    >
      {children}
    </span>
  );
};

export default Tag;
