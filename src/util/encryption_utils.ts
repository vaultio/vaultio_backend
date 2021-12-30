import { createCipheriv, randomBytes, pbkdf2Sync } from "crypto";
import { compareSync } from "bcrypt";
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

export const encryptRandomKey = (text: string) => {
  const iv = randomBytes(16);
  const key = randomBytes(32);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return [
    Buffer.concat([iv, encrypted]).toString("base64"),
    key.toString("base64"),
  ];
};

export const decryptRandomKey = (encryptedtext: string, key: string) => {
  const encryptedData = Buffer.from(encryptedtext, "base64");
  const keyBuffer = Buffer.from(key, "base64");
  const iv = encryptedData.slice(0, 16);
  const text = encryptedData.slice(16);
  const decipher = createCipheriv("aes-256-gcm", keyBuffer, iv);
  let decrypted = decipher.update(text);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const generatePasscodes = (password: string) => {
  let passCodes = [];
  let encryptedPasswords = [];
  for (let i = 0; i < 3; i++) {
    const [encrypted, key] = encryptRandomKey(password);
    passCodes.push(key);
    encryptedPasswords.push(encrypted);
  }
  return { passCodes, encryptedPasswords };
};

export const isValidPasscode = (
  passcode: string,
  hashedPassword: string,
  encryptedPasswords: string[]
) => {
  for (let i = 0; i < encryptedPasswords.length; i++) {
    try {
      if (
        compareSync(
          decryptRandomKey(encryptedPasswords[i], passcode),
          hashedPassword
        )
      )
        return true;
    } catch (error) {}
  }
  return false;
};
