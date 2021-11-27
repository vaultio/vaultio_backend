import { Application } from "express";
import authRoute from "./auth.route";
import passwordRoute from "./password.route";
export default (app: Application) => {
  app.use("/api", authRoute);
  app.use("/api", passwordRoute);
};
