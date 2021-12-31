import { decodeJWTToken } from "../util/jwt_utils";
import { Request, Response, NextFunction } from "express";
import { PUBLIC_ROUTES } from "../config";

export default function jwtMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (PUBLIC_ROUTES.includes(req.path)) return next();
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
      if (req.method === "GET") {
        req.query.access_token = token;
        req.query.user_password = decodedToken.password;
      } else {
        req.body.access_token = token;
        req.body.user_password = decodedToken.password;
      }

      return next();
    }
  }
  return res.status(400).json({
    message: "Access token is expired or missing",
  });
}
