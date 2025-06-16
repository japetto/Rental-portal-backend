import { Request, Response } from "express";
import * as tenantService from "./tenant.service";

// Get all tenants from the database
export const getTenants = async (_req: Request, res: Response) => {
  const tenants = await tenantService.getAllTenants();
  res.json(tenants);
};

// Add a new tenant to the database
export const addTenant = async (req: Request, res: Response) => {
  const tenant = await tenantService.createTenant(req.body);
  res.status(201).json(tenant);
};
