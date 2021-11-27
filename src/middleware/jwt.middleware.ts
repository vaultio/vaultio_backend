import { decodeJWTToken } from "../util/jwt_utils";
import { Request, Response, NextFunction } from "express";

export default function jwtMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.path === "/api/signin" || req.path === "/api/signup") {
    return next();
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = decodeJWTToken(token);
    if (decodedToken) {
      if (req.method === "GET") req.query.access_token = token;
      else req.body.access_token = token;

      return next();
    }
  }
  return res.status(400).json({
    message: "Access token is expired or missing",
  });
}
