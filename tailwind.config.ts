import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Quét thư mục components (nơi chứa NvvCardModal, NvvCardSystem...)
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Quét thư mục app (nếu dùng App Router)
    "./app/**/*.{js,ts,jsx,tsx,mdx}",

    // Quét thư mục src (Quan trọng nếu bạn gom code vào folder src)
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
