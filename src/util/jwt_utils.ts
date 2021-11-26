import { SECRET } from "../config";
import { verify, sign } from "jsonwebtoken";

/**
 * Returns decode JWT Authentication token
 * @author Tejasvp25 <tejasvp25@gmail.com>
 * @param {String} token    JWT Authentication Token
 * @return {Object} decoded token in form of object
 */
export const decodeJWTToken = (token: string): any => {
  try {
    return verify(token, SECRET); //   Return decoded Authentication token
  } catch {
    return undefined; //   Return {undefined} if there is error in decoding token
  }
};

/**
 * Return Authentication token
 * @author Tejasvp25 <tejasvp25@gmail.com>
 * @param {Object} obj  Object to be encoded in Authentication token
 * @param {Number} expiresIn  Expiration time (milliseconds) for Authentication token
 * @returns {String} Authentication Token
 */
export const signJWTToken = (obj: any, expiresIn: number): string =>
  sign({ ...obj }, SECRET, { expiresIn });
