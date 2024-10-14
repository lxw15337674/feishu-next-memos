'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Tag from '../Tag';
import MemoActionMenu from './MemoActionMenu';
import { Card } from '@/components/ui/card';
import { convertGMTDateToLocal, parseContent } from '@/utils/parser';
import "@github/relative-time-element";
import Editor from '../Editor';
import useMemoStore from '@/store/memo';
import { useMap, useRequest } from 'ahooks';
import useConfigStore from '@/store/config';
import { PhotoProvider } from 'react-photo-view';
import ImageViewer from '../ImageViewer';
import { ItemFields } from '../../api/type';
import { getImageUrlAction, updateMemoAction } from '../../api/larkActions';

const MemoView = ({
  tags = [],
  content,
  last_edited_time,
  created_time,
  id,
  images = [],
  link
}: ItemFields & { id: string }) => {
  const [isEdited, setIsEdited] = useState(false);
  const [urlMap, urlMapActions] = useMap<string, string>()
  const time = useMemo(() => {
    return last_edited_time ? convertGMTDateToLocal(new Date(last_edited_time)) : ' ';
  }, [last_edited_time]);
  const { updateMemo } = useMemoStore();
  const { config } = useConfigStore()
  const { runAsync: updateRecord } = useRequest(updateMemoAction, {
    manual: true,
    onSuccess: (id) => {
      if (id) {
        updateMemo(id)
        setIsEdited(false)
      }
    }
  })
  const isRecentTime = useMemo(() => {
    return created_time ? Date.now() - new Date(created_time).getTime() < 1000 * 60 * 60 * 24 : false;
  }, [created_time])

  const memoContentText = useMemo(() => {
    return content?.map?.(
      (item) => item.text,
    ) as string[]
  }, [
    content
  ])
  useEffect(() => {
    const maxBatchSize = 5; // 每次请求的最大数量
    const fetchImageUrls = async () => {
      for (let i = 0; i < images.length; i += maxBatchSize) {
        const batchImages = images.slice(i, i + maxBatchSize);
        const data = await getImageUrlAction(batchImages.map(item => item.file_token));
        data?.forEach((item) => {
          urlMapActions.set(item.file_token, item.tmp_download_url)
        })
      }
    };
    fetchImageUrls();
  }, [images]);
  const parsedContent = useMemo(() => {
    return memoContentText?.map((item) => {
      return parseContent(item)
    })
  }, [memoContentText])
  if (isEdited) {
    return (
      <div className='mb-2'>
        <Editor onSubmit={(memo) => updateRecord(id, memo)} defaultValue={memoContentText.join('\n')}
          defaultImages={images.map(item => ({ ...item, url: urlMap.get(item.file_token)! }))}
          onCancel={() => setIsEdited(false)}
          defaultLink={link}
        />
      </div>
    );
  }
  return (
    <Card className="mb-2 px-2 py-2 rounded overflow-hidden  w-full ">
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          {time}
          {isRecentTime &&
            <span className='ml-2'>
              {created_time && (<relative-time datetime={new Date(created_time).toISOString()} tense="past" />)}
            </span>
          }
        </div>
        <MemoActionMenu parsedContent={parsedContent} memoId={id} onEdit={() => setIsEdited(true)} />
      </div>
      <div className="font-medium mb-2">
        {parsedContent?.map((item, index) => (
          <p key={index} className="whitespace-pre-wrap break-words w-full leading-6 text-sm">
            { 
              item.map((item, index) => {
                if (item.type === 'tag') {
                  return <Tag
                    className="bg-blue-100 text-blue-800 font-medium mx-[1px] px-1 py-0.5  rounded dark:bg-blue-900 dark:text-blue-300 "
                    text={item.text.slice(1)}
                    key={item.text + index}
                  >
                    {item.text}
                  </Tag>
                }
                return <span key={item.text + index}>{item.text}</span>
              })
            }
          </p>
        ))}
      </div>
      {images.length > 0 &&
        <div className="flex flex-wrap gap-2  mb-2">
          <PhotoProvider
            brokenElement={<div className="w-[164px] h-[164px] bg-gray-200 text-gray-400 flex justify-center items-center">图片加载失败</div>}
          >
            {
              images.length === 1 ? <ImageViewer alt={images[0].file_token} src={urlMap.get(images[0].file_token)!}
                className="max-h-[40vh]" /> : images?.map((image) => (
                  <ImageViewer
                    key={image.file_token}
                    src={urlMap.get(image.file_token)!}
                    alt={image.file_token}
                    className="h-[164px] w-[164px]"
                  />
                ))
            }
          </PhotoProvider>
        </div>
      }
      {
        link?.link && <div className='mb-2'>
          <a href={link.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
            {link.text || link.link}
          </a>
        </div>

      }
      {
        tags.length > 0 && <div className='mb-2 '>
          {tags?.map((label) => (
            <Tag
              className="bg-blue-100 text-blue-800 font-medium me-0.5 px-1 py-0.5  rounded dark:bg-blue-900 dark:text-blue-300 "
              text={label}
              key={label}
            >
              #{label}
            </Tag>
          ))}
        </div>
      }
    </Card>
  );
};

export default MemoView;
