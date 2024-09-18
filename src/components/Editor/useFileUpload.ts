import { useState } from 'react';
import { useToast } from '../ui/use-toast';
import { uploadImageAction } from '../../api/larkActions';
import { useImmer } from 'use-immer';
import { ImageType } from '../../api/type';

interface ParsedFile {
    source: string;
    size: number;
    file: File;
    file_token?: string;
    loading: boolean;
}

export const useFileUpload = (defaultImages: ImageType[] = []) => {
    const [files, setFiles] = useImmer<ParsedFile[]>(() => {
        return defaultImages.map(image => ({
            source: image.url ?? image.name,
            size: 0,
            file: new File([], image.name),
            file_token: image.file_token,
            loading: false
        }));
    });

    const { toast } = useToast();

    const pushFile = async (file: File) => {
        if (files.length >= 9) {
            toast({
                title: '最多上传9张图片',
                description: '请删除部分图片后再上传',
                variant: 'destructive',
            });
            return;
        }
        if (file.size >= 5 * 1024 * 1024) {
            toast({
                title: '文件大小不能超过5MB',
                description: '请重新选择文件',
                variant: 'destructive',
            });
            return;
        }
        if (!file.type.includes('image')) {
            toast({
                title: '仅支持图片文件',
                description: '请重新选择文件',
                variant: 'destructive',
            });
            return;
        }
        const source = URL.createObjectURL(file);
        const newFile: ParsedFile = {
            source,
            size: file.size,
            file,
            loading: true
        };

        setFiles(draft => {
            draft.push(newFile);
        });

        const formData = new FormData();
        formData.append("file", file);

        try {
            const file_token = await uploadImageAction(formData);
            setFiles(draft => {
                const index = draft.findIndex(f => f.source === source);
                if (index !== -1) {
                    draft[index].loading = false;
                    draft[index].file_token = file_token;
                }
            });
        } catch (error) {
            setFiles(draft => {
                const index = draft.findIndex(f => f.source === source);
                if (index !== -1) {
                    draft[index].loading = false;
                }
            });
            toast({
                title: '上传失败',
                description: '请重试',
                variant: 'destructive',
            });
        }
    };

    const uploadFile = () => {
        const inputEl = document.createElement('input');
        inputEl.type = 'file';
        inputEl.accept = 'image/*';
        inputEl.multiple = true;

        const handleChange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const uploadFiles = Array.from(target.files || []);
            if (uploadFiles.length > 9) {
                toast({
                    title: '最多上传9张图片',
                    description: '只会保留前9张图片',
                });
            }

            for (let i = 0; i < Math.min(uploadFiles.length, 9); i++) {
                pushFile(uploadFiles[i]);
            }

            inputEl.removeEventListener('change', handleChange);
            inputEl.remove();
        };

        inputEl.addEventListener('change', handleChange);
        inputEl.click();
    };

    const removeFile = (index: number) => {
        setFiles(draft => {
            draft.splice(index, 1);
        });
    };

    const isUploading = files.some(file => file.loading) && files.length > 0;

    const reset = () => {
        setFiles([]);
    };

    return { files, uploadFile, removeFile, isUploading, reset, setFiles, pushFile } as const;
};