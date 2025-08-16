import mongoogeConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import Investment from "@/models/Investment";
import Return from "@/models/Return";

export const GET = async (
  request: Request,
  { params }: { params: { investmentId: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    const userId = (session.user as { id: string }).id;
    await mongoogeConnect();

    const investment = await Investment.findById(params.investmentId);
    if (!investment) throw new Error("No Investment found");

    const returns = await Return.find<ReturnProps>({
      investmentId: params.investmentId,
    });

    return NextResponse.json({ investment, returns: returns.reverse() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
