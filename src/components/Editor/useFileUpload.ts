import { useState } from 'react';
import { useToast } from '../ui/use-toast';
import { useImmer } from 'use-immer';
import { uploadToGalleryServer } from '../../api/upload';

const FILE_UPLOAD_CONFIG = {
    MAX_FILES: 9,
    MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
    ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} as const;

const ERROR_MESSAGES = {
    MAX_FILES: {
        title: '最多上传9张图片',
        description: '请删除部分图片后再上传'
    },
    FILE_SIZE: {
        title: '文件大小不能超过20MB',
        description: '请重新选择文件'
    },
    FILE_TYPE: {
        title: '仅支持图片文件',
        description: '请重新选择文件'
    },
    UPLOAD_FAILED: {
        title: '上传失败',
        description: '请重试'
    }
} as const;

interface ParsedFile {
    source: string;
    size: number;
    file: File;
    loading: boolean;
}

export const useFileUpload = (defaultImages: string[] = []) => {
    const { toast } = useToast();
    const [files, setFiles] = useImmer<ParsedFile[]>(() =>
        defaultImages.map(image => ({
            source: image,
            size: 0,
            file: new File([], image),
            loading: false
        }))
    );

    const validateFile = (file: File): boolean => {
        if (files.length >= FILE_UPLOAD_CONFIG.MAX_FILES) {
            toast({ ...ERROR_MESSAGES.MAX_FILES, variant: 'destructive' });
            return false;
        }
        if (file.size >= FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
            toast({ ...ERROR_MESSAGES.FILE_SIZE, variant: 'destructive' });
            return false;
        }
        if (!FILE_UPLOAD_CONFIG.ACCEPTED_TYPES.includes(file.type as typeof FILE_UPLOAD_CONFIG.ACCEPTED_TYPES[number])) {
            toast({ ...ERROR_MESSAGES.FILE_TYPE, variant: 'destructive' });
            return false;
        }
        return true;
    };

    const pushFile = async (file: File) => {
        if (!validateFile(file)) return;

        const source = URL.createObjectURL(file);
        const newFile: ParsedFile = {
            source,
            size: file.size,
            file,
            loading: true
        };

        setFiles(draft => { draft.push(newFile); });

        try {
            const url = await uploadToGalleryServer(file);

            if (!url) {
                throw new Error('Upload failed');
            }

            setFiles(draft => {
                const index = draft.findIndex(f => f.source === source);
                if (index !== -1) {
                    draft[index].loading = false;
                    draft[index].source = url;
                }
            });
        } catch (error) {
            setFiles(draft => {
                const index = draft.findIndex(f => f.source === source);
                if (index !== -1) {
                    draft[index].loading = false;
                }
            });
            toast({ ...ERROR_MESSAGES.UPLOAD_FAILED, variant: 'destructive' });
        }
    };

    const uploadFile = () => {
        const inputEl = document.createElement('input');
        inputEl.type = 'file';
        inputEl.accept = FILE_UPLOAD_CONFIG.ACCEPTED_TYPES.join(',');
        inputEl.multiple = true;

        const handleChange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const uploadFiles = Array.from(target.files || []);
            const filesToUpload = uploadFiles.slice(0, FILE_UPLOAD_CONFIG.MAX_FILES);

            if (uploadFiles.length > FILE_UPLOAD_CONFIG.MAX_FILES) {
                toast({
                    title: ERROR_MESSAGES.MAX_FILES.title,
                    description: '只会保留前9张图片',
                });
            }

            filesToUpload.forEach(file => pushFile(file));
            inputEl.removeEventListener('change', handleChange);
            inputEl.remove();
        };

        inputEl.addEventListener('change', handleChange);
        inputEl.click();
    };

    const removeFile = (index: number) => {
        setFiles(draft => {
            const file = draft[index];
            if (file?.source) {
                URL.revokeObjectURL(file.source);
            }
            draft.splice(index, 1);
        });
    };

    const isUploading = files.some(file => file.loading) && files.length > 0;

    const reset = () => {
        files.forEach(file => {
            if (file.source) {
                URL.revokeObjectURL(file.source);
            }
        });
        setFiles([]);
    };

    return { files, uploadFile, removeFile, isUploading, reset, setFiles, pushFile } as const;
};