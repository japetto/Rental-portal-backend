import mongoose from "mongoose";

// Create a schema for Tenant
const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tenant's name
    email: { type: String, required: true, unique: true }, // Unique email
    password: { type: String }, // Password for local login
    provider: { type: String, enum: ["local", "google"], default: "local" }, // Login method
    parkName: { type: String, required: true }, // Associated park name
    lotNumber: { type: String, required: true }, // Unit or lot number
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Export the Tenant model
export const Tenant = mongoose.model("Tenant", tenantSchema);
