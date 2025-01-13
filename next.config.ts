import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
    // Note: This is only an example. If you use Pages Router,
    // use something else that works, such as "service-worker/index.ts".
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});

const nextConfig = withSerwist({
    reactStrictMode: true,
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.feishu.cn',
                port: '',
                pathname: '/**',
            },
        ],
    }
})

export default nextConfig;
