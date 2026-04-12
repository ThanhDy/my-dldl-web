import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Tối ưu hóa URL Cloudinary bằng cách thêm các tham số nén và kích thước.
 * @param url URL gốc từ Cloudinary
 * @param width Độ rộng mong muốn (mặc định 300)
 */
export function optimizeCloudinary(url: string | undefined, width: number = 300) {
  if (!url || !url.includes("cloudinary.com")) return url;
  
  // Tìm vị trí chèn tham số (sau "/upload/")
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return url;
  
  const prefix = url.substring(0, uploadIndex + 8);
  const suffix = url.substring(uploadIndex + 8);
  
  // Thêm tham số: f_auto (định dạng), q_auto (chất lượng), w_xxx (độ rộng), c_fill (cắt cúp)
  return `${prefix}f_auto,q_auto,w_${width},c_fill,g_auto/${suffix}`;
}
