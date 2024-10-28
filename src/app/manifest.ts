import { MetadataRoute
} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next PWA with Serwist Example',
    short_name: 'My PWA',
    description: 'An example of how to use Serwist in Next.js',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fff',
    theme_color: '#fff',
    // 如果这里图标路径不对或者不符合规范，浏览器状态就不显示安装应用
    icons: [{
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
            },
            {
        src: 'icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
            },
            {
        src: 'icons/icon-384.png',
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