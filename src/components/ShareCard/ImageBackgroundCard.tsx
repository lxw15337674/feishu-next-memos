import React from 'react';
import { CardProps } from './XiaohongshuCard';



function ImageBackgroundCard({ url, content, date, cardRef, userName }: CardProps) {
    return (
        <div className="relative aspect-[3/4] w-96" ref={cardRef}>
            {/* 背景图片 */}
            <div
                className="absolute left-0 right-0 top-0 aspect-[3/4] h-full backdrop-filter backdrop-blur-none  opacity-80"
                style={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: 'cover',
                }}
            />
            {/* 背景蒙层 */}
            <div
                className="absolute left-0 right-0 top-0 h-full opacity-40 backdrop-blur-none"
                style={{ backgroundColor: '#1F2937' }}
            />
            {/* 内容区域 */}
            <div className="relative h-full w-full p-4 text-white overflow-hidden ">
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
                    <div className="w-full text-center text-2xl font-cursive font-normal">
                        {content.map((item, index) => (
                            <p className="whitespace-pre-wrap" key={index}>
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
                {/* 作者和日期 */}
                <div className="absolute bottom-6 right-2 left-2 opacity-80 text-sm text-center">
                    <div>{userName}</div>
                    <div>{date}</div>
                </div>
                {/* 来源 */}
                <div className="absolute bottom-2 right-2 text-sm text-center opacity-80">
                    <div className="text-right">💭memos</div>
                </div>
            </div>
        </div>
    );
}

export default ImageBackgroundCard;