import { Router } from "express";
import {
  showSignup,
  signin,
  signup,
  resetPassword,
} from "../controller/auth.controller";
const router = Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/showsignup", showSignup);
router.post("/resetpassword", resetPassword);

export default router;
