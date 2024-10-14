import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
});

export default withPWA({
    reactStrictMode: true,
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
    }
});