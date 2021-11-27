import { createCipheriv, randomBytes, pbkdf2Sync } from "crypto";

export const encrypt = (text: string, masterkey: string) => {
  const iv = randomBytes(16);
  const salt = randomBytes(64);
  const key = pbkdf2Sync(masterkey, salt, 2145, 32, "sha512");
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return Buffer.concat([salt, iv, encrypted]).toString("base64");
};

export const decrypt = (encryptedtext: string, masterkey: string) => {
  const encryptedData = Buffer.from(encryptedtext, "base64");
  const salt = encryptedData.slice(0, 64);
  const iv = encryptedData.slice(64, 80);
  const text = encryptedData.slice(80);
  const key = pbkdf2Sync(masterkey, salt, 2145, 32, "sha512");
  const decipher = createCipheriv("aes-256-gcm", key, iv);
  let decrypted = decipher.update(text);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
