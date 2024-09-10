import React, { LegacyRef } from 'react';

export interface CardProps {
    url?: string;
    content: string[];
    date: string;
    cardRef?: LegacyRef<HTMLDivElement>;
    userName?: string;
}

function XiaohongshuCard({ url, content, date, cardRef, userName }: CardProps) {
    return (
        <div ref={cardRef} className="relative aspect-[3/4] w-64 bg-background  p-2">
            {/* 背景图片 */}
            {url && (
                <div
                    className=" inset-0 aspect-[3/4]  backdrop-filter backdrop-blur-none  rounded-lg p-4 shadow-md"
                    style={{
                        backgroundImage: `url(${url})`,
                        backgroundSize: 'cover',
                    }}
                />
            )}
            {/* 内容区域 */}
            <div className="relative w-full pt-1  dark:text-white text-gray-900">
                {/* 作者和日期 */}
                <div className="opacity-80 text-xs mb-1 flex justify-between">
                    <span>{userName}</span>
                    <span> {date}</span>
                </div>
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
                    <div className="w-full text-sm font-cursive font-normal">
                        {content.map((item, index) => (
                            <p className="whitespace-pre-wrap" key={index}>
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="text-right text-xs opacity-80">💭memos</div>
            </div>
        </div>
    );
}

export default XiaohongshuCard;