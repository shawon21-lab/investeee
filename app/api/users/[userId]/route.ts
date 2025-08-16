import User from "@/models/User";
import { NextResponse } from "next/server";

import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface ParamsProps {
  params: { userId: string };
}

interface BodyProps {
  fullname: string;
  phoneNumber: string;
  dateOfBirth: string;
  country: string;
  city: string;
  address: string;
}

export const GET = async (request: Request, { params }: ParamsProps) => {
  try {
    await mongooseConnect();
    const user = await User.findById(params.userId);
    if (!user) throw new Error("NO USER FOUND");

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};

export const PATCH = async (request: Request, { params }: ParamsProps) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    const userId = (session.user as { id: string }).id;

    await mongooseConnect();

    const {
      fullname,
      phoneNumber,
      dateOfBirth,
      country,
      city,
      address,
    }: BodyProps = await request.json();

    const user = await User.findByIdAndUpdate<userSchemaType>(userId, {
      fullname,
      phoneNumber,
      dateOfBirth,
      country,
      city,
      address,
    });
    if (!user) throw new Error("No user Found");

    const updatedUser = await User.findById(userId);
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
