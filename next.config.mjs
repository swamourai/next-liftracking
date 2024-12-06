/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: process.env.NEXT_ESLINT_IGNORE === 'true', // Utilise la variable d'environnement pour ignorer ESLint
      },
};

export default nextConfig;
