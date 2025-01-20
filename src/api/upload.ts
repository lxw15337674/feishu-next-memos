'use server';
import sharp from 'sharp';
import axios from "axios";

const GALLERY_URL = 'https://gallery233.pages.dev';

export async function uploadToGalleryServer(
    file: File,
): Promise<string | null> {
    try {
        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const mediaBuffer = Buffer.from(arrayBuffer);

        // Compress image using Sharp
        const mainBuffer = await sharp(mediaBuffer)
            .avif({ quality: 90 })
            .toBuffer();

        console.log(`图片压缩: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(mainBuffer.length / 1024 / 1024).toFixed(2)}MB (${((1 - mainBuffer.length / file.size) * 100).toFixed(2)}%)`);

        const formData = new FormData();
        formData.append('file', new Blob([mainBuffer], { type: 'image/avif' }));

        const response = await axios.post(`${GALLERY_URL}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (!response.data[0]?.src) {
            throw new Error('上传响应缺少文件URL');
        }

        const url = `${GALLERY_URL}${response.data[0].src}`;
        return url;
    } catch (error) {
        console.error(`文件上传失败: ${error}`);
        return null;
    }
}
