import { User } from "./user.model";
import { CreateUserInput } from "./user.types";

export const createUser = async (input: CreateUserInput) => {
  return await User.create(input);
};

export const getUserById = async (id: string) => {
  return await User.findById(id);
};

export const getUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};
