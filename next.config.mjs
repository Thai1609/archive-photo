/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["firebasestorage.googleapis.com"], // ✅ Allow Firebase Storage
  },
};

export default nextConfig;
