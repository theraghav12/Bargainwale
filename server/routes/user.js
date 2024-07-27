import { Router } from "express";
import UserController from "../controllers/user.js";

const router = Router();

router.post("/api/register", UserController.register);

router.post("/api/login", UserController.login);

export default router;