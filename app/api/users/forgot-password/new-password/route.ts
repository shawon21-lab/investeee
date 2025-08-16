import mongooseConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import User from "@/models/User";
import PasswordUpdated from "@/email-templates/PasswordUpdatedEmail";
import formatDate from "@/constants/formatDate";
import Company from "@/models/Company";

interface BodyProps {
  newPassword: string;
  otp: string;
  email: string;
}

// Protectected route for user
export const POST = async (request: Request) => {
  try {
    await mongooseConnect();
    //code logic
    const companies = await Company.find({});
    const company: CompanyProps | null = companies[0];
    if (!company) throw new Error("No Comany info");

    const { newPassword, otp, email }: BodyProps = await request.json();
    const user = await User.findOne<userSchemaType>({ email });
    if (!user) throw new Error("No user found");

    if (user.recoveryCode !== otp) throw new Error("Invalid code");
    if (Date.now() > user.recoveryCodeExpiry)
      throw new Error("The code you entered is expired");

    const hashedPassword = bcrypt.hashSync(newPassword, 12);

    const updatedUser = await User.findOneAndUpdate<userSchemaType>(
      { email },
      { password: hashedPassword }
    );
    if (!updatedUser) throw new Error("No user found to update");

    const updatedDate = new Date();

    const emailText = ` You updated the password for your Paywander account on 
${formatDate(updatedDate)}. If this was you, then no further action is
required. However if you did NOT perform this password change, please reset your account 
password immediately.: ${company.baseUrl}/forgot-password 

Remember to use a password that is both strong and unique to your
Paywander account. To learn more about how to create a strong and 
unique password, click here.: ${company.baseUrl}.`;

    const emailHtml = render(
      PasswordUpdated({
        username: `${updatedUser.fullname}(${updatedUser.username})`,
        updatedDate,
        company,
      })
    );

    const result = await sendEmail(
      updatedUser.email,
      "Password Changed",
      emailText,
      emailHtml,
      company
    );
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
