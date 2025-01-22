'use client';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Icon from './Icon';
import { PhotoView } from 'react-photo-view';
import Image from 'next/image';

interface ImageProps {
    alt: string;
    src?: string;
    loading?: boolean;
    className?: string;
    onDelete?: () => void;
}

const ImageViewer: React.FC<ImageProps> = ({ alt, src = '', onDelete, className, loading }) => {
    if(!src){
        return null
    }
    return (
        <PhotoView src={src}>
            <div className={`relative rounded-lg overflow-hidden h-full group`}>
                <img
                    src={src}
                    alt={alt}
                    className={`${loading ? 'opacity-50' : 'group-hover:opacity-90'} transition-all duration-300 hover:scale-110 cursor-zoom-in ${className}`}
                    onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/600x400?text=loading`;
                    }}
                />
                {
                    loading && <div className='absolute inset-0 flex justify-center items-center'>
                        <Icon.Loader2 size={40} className="animate-spin text-white" />
                    </div>
                }
                {
                    !loading && onDelete && <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-2 text-gray-600 focus:outline-none rounded-lg opacity-70 h-[16px] w-[16px] flex justify-center items-center hover:opacity-100"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete()
                        }}
                    >
                        <Icon.CircleX size={20} />
                    </Button>
                }
            </div>
        </PhotoView>
    );
};

export default ImageViewer;

