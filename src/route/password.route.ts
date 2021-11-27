import { Router } from "express";
import {
  addPassword,
  getAllPassword,
  getPassword,
} from "../controller/password.controller";
const router = Router();

router.post("/password", addPassword);
router.get("/password/:id", getPassword);
router.get("/password", getAllPassword);

export default router;
