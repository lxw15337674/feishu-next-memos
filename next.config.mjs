/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb' // Set desired value here
        }
    }
};

export default nextConfig;
