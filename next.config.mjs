/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      }, {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      }, {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      }, {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
