import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendInvitationEmail } from "../../utils/sendgrid";
import { Tenant } from "../tenant/tenant.model";
import { InvitePayload } from "./auth.type";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateInviteToken = (payload: InvitePayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2d" });
};

export const sendInvite = async (payload: InvitePayload) => {
  const token = generateInviteToken(payload);
  const inviteLink = `${payload.siteUrl}/accept-invite?token=${token}`;

  await sendInvitationEmail({
    to: payload.email,
    name: payload.name || "User",
    inviteLink,
    parkName: payload.parkName,
    lotNumber: payload.lotNumber,
    parkAddress: payload.parkAddress,
  });

  return { success: true, message: "Invite sent" };
};

export const signupFromInvite = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  const decoded = jwt.verify(token, JWT_SECRET) as InvitePayload;

  const existing = await Tenant.findOne({ email: decoded.email });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new Tenant({
    email: decoded.email,
    password: hashedPassword,
    name: decoded.name,
    role: decoded.role,
    parkName: decoded.parkName,
    lotNumber: decoded.lotNumber,
  });

  await user.save();
  return user;
};
