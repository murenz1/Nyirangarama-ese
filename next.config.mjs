/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://nyirangarama-backend.vercel.app/api/:path*',
      },
    ]
  },
}

export default nextConfig
