import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
   const accountId = req.cookies.get("accountId");
   if (!accountId) {
      return NextResponse.json({ message: "No Fund found." }, { status: 404 });
   }

   try {
      const members = await prisma.fundMembership.findMany({
         where: {
            fundId: accountId.value
         },
         include: {
            user: true
         }
      });

      const data: any = [];
      members.map((member: any) => {
         data.push({
            id: member.user.id,
            fullName: member.user.fullName,
            phoneNumber: member.user.phoneNumber,
            state: member.user.state,
            createdAt: member.user.createdAt,
            updatedAt: member.user.updatedAt
         });
      })
      return NextResponse.json(data, { status: 200 });
   } catch (error: any) {
      console.log(error.message);
      return NextResponse.json({ message: `Something went wrong: ${error.message}` }, { status: 500 });
   }
}

export async function POST(req: NextRequest) {
   const accountId = req.cookies.get("accountId");
   if (!accountId) {
      return NextResponse.json({ message: "No Fund found." }, { status: 404 });
   }

   try {

      const { name, phone } = await req.json();

      const existingUser = await prisma.user.findUnique({
         where: { phoneNumber: phone }
      });

      if (!existingUser) {
         const user = await prisma.user.create({
            data: {
               fullName: name,
               phoneNumber: phone,
               state: "member_added"
            }
         });
         await prisma.fundMembership.create({
            data: {
               userId: user.id,
               fundId: accountId.value,
               role: "MEMBER"
            }
         });
      } else {
         await prisma.fundMembership.create({
            data: {
               userId: existingUser.id,
               fundId: accountId.value,
               role: "MEMBER"
            }
         });
      }
      return NextResponse.json({ message: "Member added successfully" }, { status: 201 });
   } catch (error: any) {
      console.log(error.message);
      return NextResponse.json({ message: `Something went wrong: ${error.message}` }, { status: 500 });
   }
}