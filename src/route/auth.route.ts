import { Router } from "express";
import { showSignup, signin, signup } from "../controller/auth.controller";
const router = Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/showsignup", showSignup);

export default router;
