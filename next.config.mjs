/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true, // Recommended for shared hosting unless you have a separate image server
  },
};

export default nextConfig;
