import { Request, Response } from "express";
import * as AuthService from "./auth.service";

export const inviteTenant = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.sendInvite(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const acceptInvite = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.signupFromInvite(req.body);
    res.json({ message: "Signup successful", user });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
