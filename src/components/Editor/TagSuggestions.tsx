'use client'
import { useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import useCountStore from '@/store/count';
import getCaretCoordinates from 'textarea-caret';
import { Card } from '../ui/card';
import classNames from 'classnames';
import { match } from 'pinyin-pro';
import { ReplaceTextFunction } from '.';
import { useKeyPress, useEventListener } from 'ahooks';

type Position = { left: number; top: number; height: number };
interface Props {
  editorRef: HTMLTextAreaElement | null;
  replaceText: ReplaceTextFunction;
}

const TagSuggestions = ({ editorRef: editor, replaceText }: Props) => {
  const [position, setPosition] = useState<Position | null>(null);
  const { tags } = useCountStore();
  const [selected, select] = useState(0);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const hide = () => setPosition(null);
  const [currentWord, setCurrentWord] = useState('');

  const getCurrentWord = (): [word: string, startIndex: number] => {
    if (!editor) return ['', 0];
    const after = editor.selectionEnd;
    const before = editor.selectionStart;
    if (before !== after) return ['', 0];

    let start = after;
    // Find the start of the current word
    for (let i = after - 1; i >= 0; i--) {
      if (editor.value[i] === '#') {
        start = i;
        break;
      }
      if (editor.value[i] === ' ') {
        // If we find a space before finding #, then there's no tag
        return ['', 0];
      }
      if (i === 0) {
        // If we reach the start without finding # or space, no tag
        return ['', 0];
      }
    }

    const word = editor.value.slice(start, after);
    return [word, start];
  };

  // Memoize suggestions calculation
  const suggestions = useMemo(() => {
    if (!currentWord.startsWith('#')) return [];

    const search = currentWord.slice(1).toLowerCase();
    if (!search) return Array.from(tags).map(tag => tag.name);

    return Array.from(tags)
      .filter((tag) => {
        const tagName = tag.name.toLowerCase();
        return tagName.includes(search) || match(tag.name, search);
      })
      .map((tag) => tag.name);
  }, [tags, currentWord]);

  const isVisible = !!(position && suggestions.length > 0);

  const autocomplete = (tag: string) => {
    const [word, start] = getCurrentWord();
    replaceText(`#${tag}`, start, start + word.length, 1);
    hide();
  };

  // Handle keyboard navigation
  useKeyPress(['uparrow', 'downarrow'], (e) => {
    if (!isVisible) return;
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'ArrowDown') {
      select((selected) => (selected + 1) % suggestions.length);
    } else {
      select((selected) => (selected - 1 + suggestions.length) % suggestions.length);
    }
  }, { target: editor });

  // Handle selection
  useKeyPress(['enter', 'tab'], (e) => {
    if (!isVisible) return;
    e.preventDefault();
    e.stopPropagation();
    autocomplete(suggestions[selectedRef.current]);
  }, { target: editor });

  // Handle escape
  useKeyPress(['escape', 'leftarrow', 'rightarrow'], () => {
    if (isVisible) hide();
  }, { target: editor });

  const handleInput = () => {
    if (!editor) return;
    select(0);
    const [word, index] = getCurrentWord();
    const isActive = word.startsWith('#');
    
    if (isActive) {
      const caretCoordinates = getCaretCoordinates(editor, index);
      const editorRect = editor.getBoundingClientRect();
      setCurrentWord(word);
      setPosition({
        left: editorRect.left + caretCoordinates.left,
        top: editorRect.top + caretCoordinates.top - editor.scrollTop,
        height: caretCoordinates.height
      });
    } else {
      setCurrentWord('');
      hide();
    }
  };

  // Handle input and blur events
  useEventListener('input', handleInput, { target: editor });
  useEventListener('click', hide, { target: editor });
  useEventListener('blur', hide, { target: editor });

  if (!isVisible || typeof document === 'undefined') return null;
  console.log('isVisible', isVisible, position)
  return createPortal(
    <Card
      className="z-50 p-1 mt-1 -ml-2 fixed max-w-[12rem] max-h-[300px] gap-px rounded font-mono flex flex-col justify-start items-start overflow-auto shadow"
      style={{ left: position.left, top: position.top + position.height }}
    >
      {suggestions.slice(0, 20).map((tag, i) => (
        <div
          key={tag}
          onMouseDown={() => autocomplete(tag)}
          className={classNames(
            'rounded p-1 px-2 w-full truncate text-sm cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-600',
            i === selected ? 'bg-zinc-300 dark:bg-zinc-600' : '',
          )}
        >
          {tag}
        </div>
      ))}
    </Card>,
    document.body
  );
};

export default TagSuggestions;
