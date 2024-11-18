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
        icons: [
            {
                src: 'icons/icon-512.png',
                sizes: '72x72',
                type: 'image/png',

            },
            {
                src: 'icons/icon-512.png',
                sizes: '96x96',
                type: 'image/png',

            },
            {
                src: 'icons/icon-512.png',
                sizes: '128x128',
                type: 'image/png',

            },
            {
                src: 'icons/icon-512.png',
                sizes: '144x144',
                type: 'image/png',

            },
            {
                src: 'icons/icon-512.png',
                sizes: '152x152',
                type: 'image/png',

            },
            {
                src: 'icons/icon-512.png',
                sizes: '192x192',
                type: 'image/png',

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