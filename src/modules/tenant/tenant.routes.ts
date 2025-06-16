import { Router } from "express";
import * as tenantController from "./tenant.controller";

const router = Router();

router.get("/", tenantController.getTenants);
router.post("/", tenantController.addTenant);

export default router;
