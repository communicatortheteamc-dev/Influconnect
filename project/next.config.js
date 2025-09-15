/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com', 'images.pexels.com']
  },
  experimental: {
    serverActions: true
  },

};

module.exports = nextConfig;