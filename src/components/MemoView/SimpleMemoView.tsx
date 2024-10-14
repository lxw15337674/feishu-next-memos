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
    content,
    images = [],
    link,
    created_time
}: ItemFields & { id: string }) => {
    const [urlMap, urlMapActions] = useMap<string, string>()
    
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
        return content?.map((item) => parseContent(item.text))
    }, [content])

    const localTime = useMemo(() => {
        return convertGMTDateToLocal(created_time);
    }, [created_time]);

    return (
        <Card className="mb-2 px-2 py-1 rounded overflow-hidden w-full">
            <div className="font-medium">
                {parsedContent?.map((item, index) => (
                    <p key={index} className="whitespace-pre-wrap break-words w-full leading-5 text-sm">
                        {item.map((subItem, subIndex) => (
                            subItem.type !== 'tag' && <span key={subItem.text + subIndex}>{subItem.text}</span>
                        ))}
                        {index === parsedContent.length - 1 && (
                            <span className="text-xs text-gray-500 ml-2">
                                {localTime}
                            </span>
                        )}
                    </p>
                ))}
            </div>
            {images.length > 0 &&
                <div className="flex flex-wrap gap-1 mt-1">
                    <PhotoProvider
                        brokenElement={<div className="w-[120px] h-[120px] bg-gray-200 text-gray-400 flex justify-center items-center">图片加载失败</div>}
                    >
                        {images.length === 1 
                            ? <ImageViewer alt={images[0].file_token} src={urlMap.get(images[0].file_token)!}
                                className="max-h-[30vh]" /> 
                            : images?.map((image) => (
                                <ImageViewer
                                    key={image.file_token}
                                    src={urlMap.get(image.file_token)!}
                                    alt={image.file_token}
                                    className="h-[120px] w-[120px]"
                                />
                            ))
                        }
                    </PhotoProvider>
                </div>
            }
            {link?.link && 
                <div className='mt-1'>
                    <a href={link.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
                        {link.text || link.link}
                    </a>
                </div>
            }
        </Card>
    );
};

export default MemoView;
