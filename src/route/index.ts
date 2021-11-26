import { Application } from "express";
import authRoute from "./auth.route";
export default (app: Application) => {
  app.use("/api", authRoute);
};
