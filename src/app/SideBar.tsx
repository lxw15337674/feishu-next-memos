import Tools from '@/components/Tools';
import React from 'react';

const SideBar: React.FC = () => {
  return (
    <div
      className="
        hidden md:flex
         h-screen
         overflow-hidden
        group  flex-col justify-start items-start    transition-all   px-4 py-4
         w-60 fixed right-0 top-0 "
    >
      <Tools />
      
    </div>
  );
};

export default SideBar;
