import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import Company from "@/models/Company";
import User from "@/models/User";

interface BodyProps {
  nowPaymentApi: string;
}

// Protectected route for admin
export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as
      | { role: string; id: string }
      | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic

    const body: BodyProps = await request.json();

    const admin = await User.findById<userSchemaType>(userSession.id);
    if (!admin) throw new Error("You're not an Admin");

    if (admin.manager !== "yes")
      throw new Error("Only manager can change payment API");

    const companies = await Company.find({});
    const company: CompanyProps | null = companies[0];
    if (!company) throw new Error("No Comany info");
    await Company.findByIdAndUpdate(company._id, {
      nowPaymentApi: body.nowPaymentApi,
    });

    return NextResponse.json("something");
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
