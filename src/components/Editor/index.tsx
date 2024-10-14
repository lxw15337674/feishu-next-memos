'use client';
import React, {  useState } from 'react';
import { Textarea } from '@mui/joy';
import Icon from '../Icon';
import TagSuggestions from './TagSuggestions';
import Box from '@mui/joy/Box';
import { Button } from '../ui/button';
import useTagStore from '@/store/tag';
import { useDebounceFn, useEventListener, useKeyPress } from 'ahooks';
import { useFileUpload } from './useFileUpload';
import ImageViewer from '../ImageViewer';
import { PhotoProvider } from 'react-photo-view';
import { ImageType, LinkType } from '../../api/type';
import LinkAction from './LinkAction.';
import { NewMemo } from '../../utils/parser';

interface Props {
  onSubmit: (memo: NewMemo) => Promise<any>;
  onCancel?: () => void;
  defaultValue?: string;
  defaultImages?: ImageType[];
  defaultLink?: LinkType;
}
export interface ReplaceTextFunction {
  (text: string, start: number, end: number, cursorOffset?: number): void
}

const Editor = ({ onSubmit, defaultValue, onCancel, defaultImages, defaultLink = {
  link: '',
  text: ''
} }: Props) => {
  const { fetchTags } = useTagStore();
  const [loading, setLoading] = React.useState(false);
  const [editorRef, setEditorRef] = useState<HTMLTextAreaElement | null>(null);
  const { files, uploadFile, removeFile, isUploading, reset, pushFile } = useFileUpload(defaultImages)
  const [link, setLink] = useState<LinkType>(defaultLink)
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
        fileTokens: files?.map(item => item.file_token!),
        link
      }).finally(() => {
        setLoading(false);
      })
    fetchTags()
    editor!.value = '';
    reset()
    setLink({
      link: '',
      text: ''
    })
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
    <div className="relative w-auto overflow-x-hidden">
      <Textarea
        className="h-full bg-card text-card-foreground"
        placeholder="此刻的想法..."
        minRows={2}
        autoFocus
        defaultValue={defaultValue}
        slotProps={{ textarea: { ref: setEditorRef } }}
        endDecorator={
          <div className='w-full'>
            <PhotoProvider
              brokenElement={<div className="w-[164px] h-[164px] bg-gray-200 text-gray-400 flex justify-center items-center">图片加载失败</div>}
            >
              <div className='flex space-x-1 pb-2'>
                {
                  files?.map((file, index) => {
                    return <ImageViewer
                      key={file.source}
                      src={file.source}
                      loading={file.loading}
                      alt='file'
                      className='h-[100px] w-[100px]'
                      onDelete={() => {
                        removeFile(index)
                      }} />
                  })
                }
              </div>
            </PhotoProvider>
            <Box
              className="py-1 border-t  flex items-center flex-auto "
            >
              <Button
                variant="ghost"
                size="icon"
                title='插入标签'
                onClick={() => {
                  if (!editorRef) {
                    return
                  }
                  replaceText('#', editorRef?.selectionStart, editorRef?.selectionStart, 0)
                }
                }
              >
                <Icon.Hash size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title='插入图片，最大9张，单张最大20MB'
                onClick={() => {
                  if (!editorRef) {
                    return
                  }
                  uploadFile()
                }
                }
              >
                <Icon.Paperclip size={20} />
              </Button>
              <LinkAction link={link} setLink={setLink} />
              <div className="flex items-center ml-auto">
                {onCancel && <Button
                  disabled={loading}
                  variant="ghost"
                  size='icon'
                  onClick={onCancel}
                  className="w-16 h-8"
                >
                  取消
                </Button>
                }
                <Button
                  disabled={isLoading}
                  variant="outline"
                  size="icon"
                  type='submit'
                  onClick={onSave}
                  className="ml-4 w-16 h-8"
                >
                  {
                    isLoading ? <Icon.Loader2 size={20} className="animate-spin" /> : <Icon.Send size={20} />
                  }
                </Button>
              </div>

            </Box>
          </div>
        }
      />
      <TagSuggestions editorRef={editorRef} replaceText={replaceText} />
    </div>
  );
};

export default Editor;
