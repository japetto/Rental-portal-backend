export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  location: string;
  password: string;
}

export interface DecodedUser {
  id: string;
  role: "superadmin" | "admin" | "tenant";
}
