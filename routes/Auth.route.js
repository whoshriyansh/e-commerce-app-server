import { Router } from "express";
import { SignIn, Logout, SignUp } from "../controllers/Auth.controller.js";

const router = Router();

router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.post("/logout", Logout);

export default router;
