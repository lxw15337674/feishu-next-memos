'use client';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Icon from './Icon';
import { PhotoView } from 'react-photo-view';
import { getImageUrlAction } from '../api/larkActions';

interface ImageProps {
    fileToken: string;
    alt: string;
    // 本地图片地址
    sourceSrc?: string;
    loading?: boolean;
    className?: string;
    onDelete?: () => void;
}

const UploadImage: React.FC<ImageProps> = ({ fileToken, alt, sourceSrc, onDelete, className, loading }) => {
    const [imageSrc, setImageSrc] = useState('');
    const [getUrlLoading, setGetUrlLoading] = useState(true);
    useEffect(() => {
        if(sourceSrc){
            return 
        }
        setGetUrlLoading(true);
        getImageUrlAction(fileToken).then((src) => {
            setImageSrc(src);
            setGetUrlLoading(false);
        })
    }, [fileToken]);
    const src = sourceSrc || imageSrc;
    return (
        <PhotoView src={src}>
            <div className={`relative  rounded-lg overflow-hidden h-full `}>
                <img src={src} alt={alt} className={`object-cover rounded-lg   ${loading ? 'opacity-50' : ''} ${className}`}
                    onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/600x400?text=${getUrlLoading ? 'loading' : 'error'}`
                    }}
                />
                {
                    loading && <div className='absolute inset-0 flex justify-center items-center'>
                        <Icon.Loader2 size={40} className="  animate-spin text-white" />
                    </div>
                }
                {
                    !loading && onDelete && <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-2  text-gray-600   focus:outline-none rounded-lg opacity-70 h-[16px] w-[16px] flex justify-center items-center hover:opacity-100"
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

export default UploadImage;

