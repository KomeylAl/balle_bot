import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const userId = params.get("userId");

  const intId = Number(userId);

  try {
    const [user] = await Promise.all([
      prisma.user.findUnique({ where: { chatId: intId }, include: { memberships: { include: { fund: true } } } })
    ]);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = {
      id: user.id,
      chatId: user.chatId?.toString(),
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      membership: user.memberships
    };


    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
