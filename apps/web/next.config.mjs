/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
