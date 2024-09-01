/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    },
};

export default nextConfig;
