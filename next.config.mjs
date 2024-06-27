/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'www.bungie.net',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
