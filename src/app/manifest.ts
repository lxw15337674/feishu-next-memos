import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Fmemos',
        short_name: 'Fmemos',
        description: 'Quick notes, powered by lark',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        // 如果这里图标路径不对或者不符合规范，浏览器状态就不显示安装应用
        icons: [
            {
                src: 'icons/icon-512.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: 'icons/icon-512.png',
                sizes: '384x384',
                type: 'image/png',
            },
            {
                src: 'icons/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}