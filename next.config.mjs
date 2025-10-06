/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-ee5e7c3df23e4a63b3a50f9bf7f41118.r2.dev',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
