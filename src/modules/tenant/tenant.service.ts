import { Tenant } from "./tenant.model";
import { TenantInput } from "./tenant.types";

// Create a new tenant in the database
export const createTenant = async (data: TenantInput) => {
  return await Tenant.create(data);
};

// Retrieve all tenants from the database
export const getAllTenants = async () => {
  return await Tenant.find();
};
