import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cho phép ảnh từ Cloudinary
      },
    ],
  },
};

export default nextConfig;
