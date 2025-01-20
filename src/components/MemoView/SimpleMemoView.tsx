'use client';
import React, { useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { convertGMTDateToLocal, parseContent } from '@/utils/parser';
import { useMap } from 'ahooks';
import { Note } from '../../api/type';

interface SimpleMemoViewProps extends Note {
    id: string;
}

interface ParsedItem {
    type: string;
    text: string;
}

const SimpleMemoView: React.FC<SimpleMemoViewProps> = ({
    content,
    images = [],
    link,
    createdAt
}) => {
    const [urlMap, urlMapActions] = useMap<string, string>();
    
    useEffect(() => {
        const fetchImageUrls = async () => {
            images.forEach((fileToken: string) => {
                urlMapActions.set(fileToken, `/api/images/${fileToken}`);
            });
        };
        fetchImageUrls();
    }, [images, urlMapActions]);

    const parsedContent = useMemo(() => {
        return parseContent(content);
    }, [content]);

    const localTime = useMemo(() => {
        return createdAt ? convertGMTDateToLocal(new Date(createdAt)) : null;
    }, [createdAt]);

    return (
        <Card className="px-2 py-1 rounded overflow-hidden w-full">
            <div className="font-medium">
                <p className="whitespace-pre-wrap break-words w-full leading-5 text-sm">
                    {parsedContent.map((subItem: ParsedItem, subIndex: number) => (
                        subItem.type !== 'tag' && <span key={subItem.text + subIndex}>{subItem.text}</span>
                    ))}
                    <span className="text-xs text-gray-500 ml-2">
                        {localTime}
                    </span>
                </p>
            </div>
            {link?.url && 
                <div className='mt-1'>
                    <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
                        {link.text || link.url}
                    </a>
                </div>
            }
        </Card>
    );
};

export default SimpleMemoView;
