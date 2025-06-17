import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface InviteEmail {
  to: string;
  name: string;
  inviteLink: string;
  parkName: string;
  lotNumber: string;
  parkAddress?: string;
}

export const sendInvitationEmail = async ({
  to,
  name,
  inviteLink,
  parkName,
  lotNumber,
  parkAddress,
}: InviteEmail) => {
  const msg = {
    to,
    from: "noreply@yourapp.com",
    subject: `You're invited to ${parkName} Tenant Portal`,
    html: `
      <p>Hi ${name},</p>
      <p>You’ve been invited to join the tenant portal for ${parkName}.</p>
      <p><strong>Lot:</strong> ${lotNumber}</p>
      <p>${parkAddress ? `<strong>Address:</strong> ${parkAddress}</p>` : ""}
      <p><a href="${inviteLink}">Click here to join</a></p>
    `,
  };

  await sgMail.send(msg);
};
