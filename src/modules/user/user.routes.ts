import { Router } from "express";
import { getUser, registerUser } from "./user.controller";

const router = Router();

router.post("/", registerUser);
router.get("/:id", getUser);

export default router;
