import React from 'react';
import Icon from '../Icon';

interface FilterTagProps {
    children?: React.ReactNode;
    onClear: () => void;
}

const FilterTag: React.FC<FilterTagProps> = ({ children, onClear }) => {
    return (
        <div
            className="flex justify-start items-center px-2 my-0.5  mr-2 cursor-pointer dark:text-gray-400 bg-gray-200 dark:bg-zinc-800 rounded hover:line-through "
            onClick={onClear}
        >
            <div className="truncate max-w-xs">{children}</div>
            <Icon.X className="w-4 h-auto ml-1 opacity-60" />
        </div>
    );
};

export default FilterTag;