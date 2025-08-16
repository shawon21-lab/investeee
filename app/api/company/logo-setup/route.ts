import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import Company from "@/models/Company";

interface BodyProps {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  original_filename: string;
  created_at: string;
  etag: string;
  thumbnail_url: string;
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

    const body: BodyProps = await request.json();
    const companies = await Company.find({});
    const company: CompanyProps | null = companies[0];
    if (!company) throw new Error("No Comany info");
    await Company.findByIdAndUpdate(company._id, {
      logo: body,
    });

    return NextResponse.json({ message: "Operation successful" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
