import { Router } from "express";
import { authenticate, isSuperAdmin } from "../../middlewares/auth.middleware";
import { inviteTenant } from "./auth.controller";

const router = Router();

// 📩 Send invitation (Super Admin only)
router.post("/invite", authenticate, isSuperAdmin, inviteTenant);

export default router;
