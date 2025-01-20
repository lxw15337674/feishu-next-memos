'use client';
import React, { useMemo, useState, useCallback } from 'react';
import Tag from '../Tag';
import MemoActionMenu from './MemoActionMenu';
import { Card } from '@/components/ui/card';
import { convertGMTDateToLocal, parseContent } from '@/utils/parser';
import "@github/relative-time-element";
import Editor from '../Editor';
import useMemoStore from '@/store/memo';
import { useRequest } from 'ahooks';
import ImageViewer from '../ImageViewer';
import { updateMemoAction } from '../../api/dbActions';
import Link from 'next/link';
import { Note } from '../../api/type';

interface MemoContentProps {
  content: string;
  isRecentTime: boolean;
  time: string;
  createdAt: string;
}

const MemoContent = React.memo(({ content, isRecentTime, time, createdAt }: MemoContentProps) => (
  <div className="flex flex-col gap-1">
    <div className="text-xs text-gray-500">
      {isRecentTime ? (
        <time dateTime={createdAt}>
          {new Date(createdAt).toLocaleString()}
        </time>
      ) : time}
    </div>
    <div className="text-sm space-y-1">
      {content.split('\n').map((text, index) => (
        <p key={index} className="whitespace-pre-wrap break-words leading-6">
          {parseContent(text).map((subItem, subIndex) => (
            subItem.type !== 'tag' && <span key={subItem.text + subIndex}>{subItem.text}</span>
          ))}
        </p>
      ))}
    </div>
  </div>
));

const MemoView = ({
  tags,
  content,
  images = [],
  link,
  createdAt,
  updatedAt,
  id,
}: Note) => {
  const [isEdited, setIsEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const time = useMemo(() => {
    return updatedAt ? convertGMTDateToLocal(updatedAt) : ' ';
  }, [updatedAt]);

  const { updateMemo } = useMemoStore();

  const { runAsync: updateRecord } = useRequest(updateMemoAction, {
    manual: true,
    onSuccess: (id) => {
      if (id) {
        updateMemo(id);
        setIsEdited(false);
      }
    }
  });

  const isRecentTime = useMemo(() => {
    return createdAt ? Date.now() - new Date(createdAt).getTime() < 1000 * 60 * 60 * 24 : false;
  }, [createdAt]);

  const handleEdit = useCallback(() => setIsEdited(true), []);
  const handleCancel = useCallback(() => setIsEdited(false), []);

  const handleSubmit = useCallback(async (memo: any) => {
    setIsLoading(true);
    try {
      await updateRecord(id, memo);
    } finally {
      setIsLoading(false);
    }
  }, [id, updateRecord]);

  if (isEdited) {
    return <Editor
      defaultValue={content}
      defaultImages={images}
      defaultLink={link}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  }

  return (
    <Card className={`p-3 relative ${isLoading ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 mr-2">
          <MemoContent
            content={content}
            isRecentTime={isRecentTime}
            time={time}
            createdAt={createdAt as unknown as string}
          />
        </div>
        <MemoActionMenu
          memoId={id}
          onEdit={handleEdit}
          parsedContent={content.split('\n').map(text => parseContent(text))}
        />
      </div>

      {images.length > 0 && (
        <div className={`grid auto-rows-fr gap-2 mt-2 ${images.length === 1 ? 'grid-cols-1' :
          images.length === 2 ? 'grid-cols-2' :
            images.length === 3 ? 'grid-cols-2 md:grid-cols-3' :
              images.length === 4 ? 'grid-cols-2' :
                'grid-cols-2 md:grid-cols-3'
          }`}>
          {images.map((image, index) => (
            <div
              key={image}
              className={`relative ${images.length === 3 && index === 0 ? 'md:col-span-2' :
                images.length === 4 && index === 0 ? 'col-span-2' :
                  ''
                } aspect-square w-full`}
            >
              <ImageViewer
                src={image}
                alt={image}
                className="absolute inset-0 w-full h-full object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}

      {link?.url && (
        <div className='mt-3'>
          <Link
            href={link.url}
            target="_blank"
            rel="noreferrer"
            title={link.text || link.url}
            className="text-blue-500 hover:text-blue-600 hover:underline truncate block text-sm transition-colors"
          >
            {link.text || link.url}
          </Link>
        </div>
      )}

      {tags.length > 0 && (
        <div className='flex flex-wrap gap-1.5 mt-3'>
          {tags.map((tag) => (
            <Tag
              key={tag.id}
              className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-md hover:bg-blue-100 transition-colors dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
              text={tag.name}
            >
              #{tag.name}
            </Tag>
          ))}
        </div>
      )}
    </Card>
  );
};

export default MemoView;
