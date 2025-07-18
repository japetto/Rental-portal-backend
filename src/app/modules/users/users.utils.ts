import crypto from "crypto";
import CryptoJS from "crypto-js";
import { Secret } from "jsonwebtoken";
import config from "../../../config/config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { IUserWithoutPassword } from "./users.interface";

export function encryptData(user: IUserWithoutPassword) {
  const authData = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(authData),
    String(config.jwt_secret),
  ).toString();
  return encryptedData;
}

// Generate AuthToken
export const generateAuthToken = (user: IUserWithoutPassword) => {
  const accessToken = jwtHelpers.createToken(
    {
      id: user._id,
    },
    config.jwt_secret as Secret,
    config.jwt_expires_in as string,
  );

  const encryptedUserData = encryptData(user as any);

  return {
    token: accessToken,
    userData: encryptedUserData,
  };
};

// export const encryptForgotPasswordResponse = (data: string) => {
//   const ENCRYPTION_KEY = config.redis_crypto_key;
//   const ALGORITHM = "aes-256-cbc";

//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv(
//     ALGORITHM,
//     Buffer.from(ENCRYPTION_KEY),
//     iv,
//   );
//   let encryptData = cipher.update(data, "utf8", "hex");
//   encryptData += cipher.final("hex");
//   return iv.toString("hex") + ":" + encryptData;
// };

// export const decryptForgotPasswordResponse = (encryptedData: string) => {
//   const ENCRYPTION_KEY = config.redis_crypto_key;
//   const ALGORITHM = "aes-256-cbc";

//   const [ivHex, encryptedText] = encryptedData.split(":");
//   const iv = Buffer.from(ivHex, "hex");

//   const decipher = crypto.createDecipheriv(
//     ALGORITHM,
//     Buffer.from(ENCRYPTION_KEY),
//     iv,
//   );
//   let decrypted = decipher.update(encryptedText, "hex", "utf8");
//   decrypted += decipher.final("utf8");

//   return decrypted;
// };

// ! Do Not remove it
// export function decryptData(
//   encryptedData: string,
//   secretKey: string,
// ): IUserWithoutPassword {
//   const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
//   const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//   return decryptedData as IUserWithoutPassword;
// }
