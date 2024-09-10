'use client'
import React from 'react';
import { ModeToggle } from './ModeToggle';
import { Setting } from './Setting';

const LeftSide = () => {
  return (
    <div
      suppressHydrationWarning 
      className="
        hidden 
        md:flex
        justify-between
        fixed md:w-40  group  top-0 left-0 select-none border-r dark:border-zinc-800 h-full bg-zinc-50 dark:bg-zinc-800 dark:bg-opacity-40 transition-all hover:shadow-xl z-2  p-4"
    >
      <Setting />
      <ModeToggle />
    </div>
  );
};

export default LeftSide;
