const encoder = new TextEncoder();

// Khởi tạo CryptoKey từ khóa bí mật
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const keyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Ký số payload và trả về mã hex chữ ký
export async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Xác thực chữ ký của payload
export async function verifyPayload(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const key = await getCryptoKey(secret);
    const signatureBuffer = new Uint8Array(
      signature.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );
    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      encoder.encode(payload)
    );
  } catch (e) {
    return false;
  }
}

// Phiên đăng nhập có thời hạn 7 ngày
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

/**
 * Tạo session token bảo mật có dạng: expiresAt.signature
 */
export async function generateSessionToken(secret: string): Promise<string> {
  const expiresAt = (Date.now() + SESSION_DURATION).toString();
  const signature = await signPayload(expiresAt, secret);
  return `${expiresAt}.${signature}`;
}

/**
 * Xác thực session token
 */
export async function verifySessionToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [expiresAt, signature] = parts;
  const expirationTime = parseInt(expiresAt, 10);

  // Kiểm tra xem token đã hết hạn chưa
  if (isNaN(expirationTime) || expirationTime < Date.now()) {
    return false;
  }

  // Xác thực chữ ký để đảm bảo token chưa bị giả mạo
  return await verifyPayload(expiresAt, signature, secret);
}
