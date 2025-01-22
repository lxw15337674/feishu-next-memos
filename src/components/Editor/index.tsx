'use client';
import React, { useState } from 'react';
import Icon from '../Icon';
import TagSuggestions from './TagSuggestions';
import { Button } from '../ui/button';
import { useDebounceFn, useEventListener, useKeyPress } from 'ahooks';
import { useFileUpload } from './useFileUpload';
import ImageViewer from '../ImageViewer';
import { PhotoProvider } from 'react-photo-view';
import LinkAction, { LinkType } from './LinkAction';
import { AutosizeTextarea } from '../ui/AutosizeTextarea';
import { LucideIcon } from 'lucide-react';
import { Link } from '@prisma/client';
import { NewMemo } from '../../api/type';

interface Props {
  onSubmit: (memo: NewMemo) => Promise<any>;
  onCancel?: () => void;
  defaultValue?: string;
  defaultImages?: string[];
  defaultLink?: Link;
}
export interface ReplaceTextFunction {
  (text: string, start: number, end: number, cursorOffset?: number): void
}

interface ToolbarButtonProps {
  icon: LucideIcon;
  title: string; 
  onClick: () => void;
  disabled?: boolean;
}

// Extract toolbar buttons into a separate component
const ToolbarButton = ({ icon: Icon, title, onClick, disabled = false }: ToolbarButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    title={title}
    onClick={onClick}
    disabled={disabled}
  >
    <Icon size={20} />
  </Button>
);

const Editor = ({ onSubmit, defaultValue, onCancel, defaultImages, defaultLink }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const [editorRef, setEditorRef] = useState<HTMLTextAreaElement | null>(null);
  const { files, uploadFile, removeFile, isUploading, reset, pushFile } = useFileUpload(defaultImages)
  const [link, setLink] = useState<LinkType | undefined>(defaultLink)
  const { run: replaceText } = useDebounceFn<ReplaceTextFunction>((text, start, end, offset = 0) => {
    const editor = editorRef;
    if (editor) {
      const value = editor.value;
      const newValue = value.slice(0, start) + `${text} ` + value.slice(end);
      editor.value = newValue;
      setTimeout(() => {
        editor.selectionStart = start + text.length + offset;
        editor.selectionEnd = start + text.length + offset;
        editor.focus();
        // 触发事件
        const event = new Event('input');
        editor.dispatchEvent(event);
      }, 100);
    }
  }, { wait: 200 });
  const [isFocused, setIsFocused] = useState(false);
  const onSave = async () => {
    const editor = editorRef;
    if (!editor) {
      return
    }
    const content = editor.value ?? '';
    if (content.trim().length === 0) return;
    setLoading(true); 
    await onSubmit?.(
      {
        content,
        images: files?.map(item => item.source),
        link
      }).finally(() => {
        setLoading(false);
      })
    editor!.value = '';
    reset()
    setLink(undefined)
  };
  useKeyPress('ctrl.enter', (e) => {
    // 判断是否focus
    if (editorRef === document.activeElement) {
      e.preventDefault();
      e.stopPropagation();
      onSave();
    }
  });

  useEventListener('paste', (e) => {
    if (editorRef === document.activeElement) {
      if (e?.clipboardData?.items?.length === 0) return
      const items = e?.clipboardData?.items as DataTransferItemList;

      for (let i = 0; i < items?.length; i++) {
        if (items[i].type.indexOf('image') === 0) {
          pushFile(items[i].getAsFile()!);
        }
      }
    }
  })
  const isLoading = loading || isUploading
  return (
    <div className={`relative w-auto overflow-x-hidden h-full border bg-background rounded-md transition-colors duration-200 ${isFocused ? 'border-blue-500' : 'border-input'}`}>
      <div className="flex flex-col h-full">
        <AutosizeTextarea
          className='resize-none border-none text-base p-3 min-h-[120px] '
          placeholder="此刻的想法..."
          autoFocus
          defaultValue={defaultValue}
          ref={(ref) => setEditorRef(ref?.textArea ?? null)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <div className='px-3'>
          <PhotoProvider
            brokenElement={<div className="w-[164px] h-[164px] bg-gray-200 text-gray-400 flex justify-center items-center">图片加载失败</div>}
          >
            <div className='flex flex-wrap gap-2 pb-2'>
              {files?.map((file, index) => (
                <ImageViewer
                  key={file.source}
                  src={file.source}
                  loading={file.loading}
                  alt='file'
                  className='h-[100px] w-[100px] object-cover rounded-md'
                  onDelete={() => removeFile(index)}
                />
              ))}
            </div>
          </PhotoProvider>

          <div className='flex items-center border-t py-2 gap-1'>
            <div className="flex items-center gap-1">
              <ToolbarButton
                icon={Icon.ClipboardPaste}
                title='粘贴剪切板内容'
                onClick={() => {
                  if (!editorRef) return;
                  editorRef.focus();
                  navigator.clipboard.readText().then(text => {
                    replaceText(text, editorRef?.selectionStart, editorRef?.selectionStart, 0);
                  });
                }}
              />
              <ToolbarButton
                icon={Icon.Paperclip}
                title='插入图片，最大9张，单张最大20MB'
                onClick={() => {
                  if (!editorRef) return;
                  uploadFile();
                }}
                disabled={files?.length >= 9}
              />
              <LinkAction link={link} setLink={setLink} />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {onCancel && (
                <Button
                  disabled={loading}
                  variant="ghost"
                  onClick={onCancel}
                  className="px-4"
                >
                  取消
                </Button>
              )}
              <Button
                disabled={isLoading}
                variant="outline"
                onClick={onSave}
                className="px-4"
              >
                {isLoading ? (
                  <Icon.Loader2 size={20} className="animate-spin mr-2" />
                ) : (
                  <Icon.Send size={20} className="mr-2" />
                )}
                发送
              </Button>
            </div>
          </div>
        </div>
      </div>
      <TagSuggestions editorRef={editorRef} replaceText={replaceText} />
    </div>
  );
};

export default Editor;
