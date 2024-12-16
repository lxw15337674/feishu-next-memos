import { useEffect,  useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useTagStore from '@/store/tag';
import getCaretCoordinates from 'textarea-caret';
import { Card } from '../ui/card';
import classNames from 'classnames';
import { match } from 'pinyin-pro';
import { ReplaceTextFunction } from '.';

type Position = { left: number; top: number; height: number };
interface Props {
  editorRef: HTMLTextAreaElement | null;
  replaceText: ReplaceTextFunction;
}
const TagSuggestions = ({ editorRef, replaceText }: Props) => {
  const [position, setPosition] = useState<Position | null>(null);
  const tagStore = useTagStore();
  const tagsRef = useRef(Array.from(tagStore.tags));
  tagsRef.current = Array.from(tagStore.tags);
  const editor = editorRef
  const [selected, select] = useState(0);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const hide = () => setPosition(null);

  const getCurrentWord = (): [word: string, startIndex: number] => {
    if (!editor) return ['', 0];
    const after = editor.selectionEnd;
    const before = editor.selectionStart
    if (before !== after) {
      return ['', 0]
    }
    for (let i = after - 1; i >= 0; i--) {
      if (['#', ' '].includes(editor.value[i])) {
        return [editor.value.slice(i, after), i]
      }
    }
    return [editor.value.slice(0, after), 0]
  };

  const suggestionsRef = useRef<string[]>([]);
  suggestionsRef.current = (() => {
    const search = getCurrentWord()[0].slice(1).toLowerCase();
    const keyword = getCurrentWord()[0].slice(1)
    return tagsRef.current
      .filter((tag) => tag.name.toLowerCase().includes(search) || match(tag.name, keyword))
      .map((tag) => tag.name);
  })();

  const isVisibleRef = useRef(false);
  isVisibleRef.current = !!(position && suggestionsRef.current.length > 0);

  const autocomplete = (tag: string) => {
    const [word, start] = getCurrentWord();
    replaceText(`#${tag}`, start, start + word.length, 1);
    hide();
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isVisibleRef.current) return;
    const suggestions = suggestionsRef.current;
    const selected = selectedRef.current;
    if (['Escape', 'ArrowLeft', 'ArrowRight'].includes(e.key)) hide();
    if ('ArrowDown' === e.key) {
      select((selected + 1) % suggestions.length);
      e.preventDefault();
      e.stopPropagation();
    }
    if ('ArrowUp' === e.key) {
      select((selected - 1 + suggestions.length) % suggestions.length);
      e.preventDefault();
      e.stopPropagation();
    }
    if (['Enter', 'Tab'].includes(e.key)) {
      autocomplete(suggestions[selected]);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleInput = () => {
    if (!editor) return;
    select(0);
    const [word, index] = getCurrentWord();
    const currentChar = editor.value[editor.selectionEnd];
    const isActive = word.startsWith('#') && currentChar !== '#';
    
    if (isActive) {
      const caretCoordinates = getCaretCoordinates(editor, index);
      const editorRect = editor.getBoundingClientRect();
      
      const left = editorRect.left + caretCoordinates.left;
      const top = editorRect.top + caretCoordinates.top - editor.scrollTop;
      
      setPosition({
        left,
        top,
        height: caretCoordinates.height
      });
    } else {
      hide();
    }
  };

  const listenersAreRegisteredRef = useRef(false);
  const registerListeners = () => {
    if (!editor || listenersAreRegisteredRef.current) return;
    editor.addEventListener('click', hide);
    editor.addEventListener('blur', hide);
    editor.addEventListener('keydown', handleKeyDown);
    editor.addEventListener('input', handleInput);
    listenersAreRegisteredRef.current = true;
  };
  useEffect(registerListeners, [!!editor]);

  // New state to store the portal container
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    registerListeners();
    
    // Create a div element to serve as the portal container
    const container = document.createElement('div');
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      // Clean up the portal container on unmount
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, [!!editor]);

  if (!isVisibleRef.current || !position || !portalContainer) return null;

  const suggestionsList = (
    <Card
      className="z-50 p-1 mt-1 -ml-2 fixed max-w-[12rem] gap-px rounded font-mono flex flex-col justify-start items-start overflow-auto shadow"
      style={{ left: position.left, top: position.top + position.height }}
    >
      {suggestionsRef.current.slice(0,20).map((tag, i) => (
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
    </Card>
  );

  return createPortal(suggestionsList, portalContainer);
};

export default TagSuggestions;
