import mongoogeConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";

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

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    const userId = (session.user as { id: string }).id;
    await mongoogeConnect();

    const body: BodyProps = await request.json();
    const user = await User.findById<userSchemaType>(userId);
    if (!user) throw new Error("User not Found");

    const updatedUser = await User.findByIdAndUpdate(userId, {
      avatar: body,
    });
    if (!updatedUser) throw new Error("User not Found");

    const latestUserUpdate = await User.findById<userSchemaType>(userId);

    return NextResponse.json(latestUserUpdate);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
