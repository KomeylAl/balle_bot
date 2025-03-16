import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   
   const accountId = await req.json();

   const cookie = `accountId=${accountId}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24};`;

   const headers = new Headers();
   headers.append("Set-Cookie", cookie);

   return new NextResponse(JSON.stringify({ message: "ID saved." }), {
      headers,
    });
}