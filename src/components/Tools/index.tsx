import React from 'react';
import TagsSection from './TagsSection';
import Count from './Count';
import ActivityCalendar from '../ActivityCalendar';
import { SearchInput } from './SearchInput';

const Tools: React.FC = () => {
  return (
    <>
      <div className="mb-2 w-full">
        <SearchInput />
      </div>
      <div className="mb-2 w-full">
        <Count />
      </div>
      <div className="mb-2 w-full">
        <ActivityCalendar />
      </div>
      <TagsSection />
    </>
  );
};

export default Tools;
