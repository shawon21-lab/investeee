import mongooseConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import User from "@/models/User";
import generateOtp from "@/constants/generateOtp";
import ResetPasswordEmail from "@/email-templates/ResetPasswordEmail";
import Company from "@/models/Company";

// Protectected route for user
export const POST = async (request: Request) => {
  try {
    const oneHour = 3600000;
    await mongooseConnect();
    //code logic

    const companies = await Company.find({});
    const company: CompanyProps | null = companies[0];
    if (!company) throw new Error("No Comany info");

    const { email }: { email: string } = await request.json();

    const user = await User.findOne<userSchemaType>({ email });
    if (!user) throw new Error("No user Found");

    const otp = generateOtp();
    const expiry = Date.now() + oneHour;

    await User.findOneAndUpdate(
      { email },
      { recoveryCode: otp, recoveryCodeExpiry: expiry }
    );

    const emailText = `Someone recently requested a password change for your Paywander
account. If this was you, you can copy the code: ${otp} \ .Code will be available for 1 hour. If you don't want to change your password or didn't
request this, just ignore and delete this message. \  To keep your account secure, please don&apos;t forward this email
to anyone. Contact us for any assistant: ${company.baseUrl}`;

    const htmlData = render(
      ResetPasswordEmail({
        userFirstname: user.fullname,
        resetPasswordCode: otp,
        company,
      })
    );

    const result = await sendEmail(
      user.email,
      "Reset Password",
      emailText,
      htmlData,
      company
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
