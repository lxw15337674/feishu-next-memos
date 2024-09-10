import { useState } from 'react';
import { useToast } from '../ui/use-toast';

interface ParsedFile {
    source: string;
    size: number;
    file: File;
    url: string;
    loading: boolean;
}

export const useFileUpload = (defaultUrls?: string[]) => {
    const [files, setFiles] = useState<ParsedFile[]>(() => {
        if (defaultUrls) {
            return defaultUrls.map(url => ({
                source: url,
                size: 0,
                file: new File([], url),
                url: url,
                loading: false
            }))
        }
        return []
    })
    const { toast } = useToast();
    // 上传到图床
    const uploadToGallery = (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then((res: Response) => res.json())
            .then((data: { src: string }[]) => data[0]?.src)
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    const pushFile = (file: File) => {
        if (files.length >= 9) {
            toast({
                title: '最多上传9张图片',
                description: '请删除部分图片后再上传',
                variant: 'destructive',
            });
            return
        }
        if (file.size >= 5 * 1024 * 1024) {
            toast({
                title: '文件大小不能超过5MB',
                description: '请重新选择文件',
                variant: 'destructive',
            });
            return
        }
        // 限制图片文件
        if (!file.type.includes('image')) {
            toast({
                title: '仅支持图片文件',
                description: '请重新选择文件',
                variant: 'destructive',
            });
            return
        }
        const newFile: ParsedFile = {
            source: URL.createObjectURL(file),
            size: file.size,
            file,
            url: '',
            loading: true
        };

        setFiles(prevFiles => {
            const updatedFiles = [...prevFiles, newFile];
            const index = updatedFiles.length - 1;

            uploadToGallery(file).then((src) => {
                setFiles(currentFiles => {
                    return currentFiles.map((item, i) => {
                        if (i === index) {
                            console.log(i, '上传到图床', src);
                            return {
                                ...item,
                                url: `https://telegraph-image-bww.pages.dev${src}`,
                                loading: false
                            };
                        }
                        return item;
                    });
                });
            });

            return updatedFiles;
        });
    }
    const uploadFile = () => {
        // 创建 input 元素
        const inputEl = document.createElement('input');
        inputEl.type = 'file';
        inputEl.accept = 'image/*'; // 限制图片文件
        inputEl.multiple = true;
        // 处理文件选择
        const handleChange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const files = Array.from(target.files || [])
            // 更新文件状态
            for (let i = 0; i < files.length; i++) {
                pushFile(files[i])
            }
            // 移除事件监听和 input 元素
            inputEl.removeEventListener('change', handleChange);
            inputEl.remove();
        };

        // 添加事件监听
        inputEl.addEventListener('change', handleChange);

        // 触发文件选择
        inputEl.click();
    }
    const removeFile = (index: number) => {
        files?.splice(index, 1);
        setFiles([...files!]);
    }
    const isUploading = files?.some((file) => file.loading) && files?.length > 0;
    const reset = () => {
        setFiles([])
    }

    return { files, uploadFile, removeFile, isUploading, reset, setFiles, pushFile } as const
};