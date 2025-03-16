import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
   const id = req.cookies.get("accountId");
   if (!id) {
      return NextResponse.json({ message: "No account selected." }, { status: 422 });
   }

   try {
      const [account] = await Promise.all([
         await prisma.fund.findUnique({ where: { id: id.value } })
      ]);

      return NextResponse.json(account, { status: 200 });
   } catch (error: any) {
      return NextResponse.json({ message: `Somethings went wrong: ${error.message}` }, { status: 500 });
   }
}