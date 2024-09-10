interface UploadFileOptions {
    accept?: string; // 文件类型限制
    multiple?: boolean; // 是否允许多选
    onSuccess?: (files: File[]) => void; // 上传成功回调
    onError?: (error: Error) => void; // 上传失败回调
}

export const uploadFile = (options: UploadFileOptions = {}) => {
    // 创建 input 元素
    const inputEl = document.createElement('input');
    inputEl.type = 'file';
    inputEl.accept = options.accept || '*'; // 默认所有文件类型
    inputEl.multiple = options.multiple || false;

    // 处理文件选择
    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const files = Array.from(target.files || []);

        // 上传逻辑
        if (options.onSuccess) {
            try {
                options.onSuccess(files);
            } catch (error) {
                if (options.onError) {
                    options.onError(error as Error);
                }
            }
        } else {
            // 如果没有成功回调，直接执行失败回调
            if (options.onError) options.onError(new Error('No onSuccess callback provided'));
        }

        // 移除事件监听和 input 元素
        inputEl.removeEventListener('change', handleChange);
        inputEl.remove();
    };

    // 添加事件监听
    inputEl.addEventListener('change', handleChange);

    // 触发文件选择
    inputEl.click();
};


interface DownloadFileOptions {
    data: Blob | string; // 数据内容，可以是 Blob 或字符串
    filename: string; // 文件名
    mimeType?: string; // 文件MIME类型
}

export const downloadFile = (options: DownloadFileOptions) => {
    const { data, filename, mimeType = 'application/octet-stream' } = options; // 默认MIME类型为二进制流

    const link = document.createElement('a');
    link.href = URL.createObjectURL(typeof data === 'string' ? new Blob([data], { type: mimeType }) : data);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // 清理 DOM 节点
};