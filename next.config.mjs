/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      DATABASE_URL: process.env.DATABASE_URL, // Assurez-vous que la variable est disponible
    },
};

export default nextConfig;
