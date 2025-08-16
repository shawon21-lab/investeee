import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import User from "@/models/User";
import CustomEmail from "@/email-templates/CustomEmail";
import Company from "@/models/Company";

interface BodyProps {
  message: string;
  userId: string;
  subject: string;
}

// Protectected route for admin
export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as { role: string } | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic
    const { message, userId, subject }: BodyProps = await request.json();
    const user = await User.findById<userSchemaType>(userId);
    if (!user) throw new Error("No User Found");

    const companies = await Company.find({});
    const company: CompanyProps = companies[0];
    if (!company) throw new Error("No Comany info");

    const emailHtml = render(
      CustomEmail({
        username: `${user.fullname}(${user.username})`,
        message,
        company,
      })
    );
    const result = await sendEmail(
      user.email,
      subject,
      message,
      emailHtml,
      company
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
