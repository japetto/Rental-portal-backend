export interface InvitePayload {
  email: string;
  name?: string;
  parkName: string;
  lotNumber: string;
  parkAddress?: string;
  siteUrl?: string;
  role: "tenant";
}

export interface SignupPayload {
  token: string;
  password: string;
}
