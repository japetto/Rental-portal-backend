// Define the shape of data required to create a new Tenant

export interface TenantInput {
  name: string;
  email: string;
  password?: string;
  provider?: "local" | "google";
  parkName: string;
  lotNumber: string;
}
