import prisma from "@/lib/prisma";
import { formatPhoneNumber } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const state = { userId: '', state: '' };
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || (!body.message && !body.callback_query)) {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const userId = body.message?.chat?.id || body.callback_query?.from?.id;
    if (!userId) {
      return NextResponse.json({ message: "User ID not found" }, { status: 400 });
    }

    let text = body.message?.text?.trim();
    let callbackData = body.callback_query?.data;
    
    let user = await prisma.user.findUnique({ where: { chatId: userId } });
    let userPhoneVerified: any;

    if (text === "/start") {
      if (!user) {
        await sendMessage(userId, "👋 سلام.\nبه گنجه نیکو خوش اومدین.\nتوجه کنید:\nاگر فرد دیگه ای شما رو عضو صندوقی کرده باشه، میتونین مشاهده کنین. البته خودتون هم میتونین صندوق خودتون رو بسازین و اعضای جدید بهش اضافه کنین.\n.لطفا برای شروع شماره موبایل خودتون رو ارسال کنین");
        await sendHelloOptions(userId);
        state.state = "waiting_for_phone";
        state.userId = userId;
        return NextResponse.json({ message: "Waiting for user phone" });
      } else {
        // دریافت لیست صندوق‌های کاربر و نقش‌ها
        const memberships = await prisma.fundMembership.findMany({
          where: { userId: user.id },
          include: { fund: true }
        });
      
        let message = "✅ شما قبلاً ثبت‌نام کرده‌اید.\n";
        if (memberships.length > 0) {
          message += "💼 صندوق‌های شما:\n";
          memberships.forEach(m => {
            message += `🔹 ${m.fund.name} - ${m.role === "ADMIN" ? "مدیر" : "عضو"}\n`;
          });
        } else {
          message += "❌ شما عضو هیچ صندوقی نیستید.";
        }
      
        await sendMessage(userId, message);
        await sendOptions(userId, true);
        return NextResponse.json({ message: "User already registered" });
      }
    }

    console.log(state);

    if (state.state === 'waiting_for_phone' && body.message.contact.phone_number) {
      console.log("hello")
      const phone = formatPhoneNumber(body.message.contact.phone_number);
      const user = await prisma.user.findUnique({ where: { phoneNumber: phone } });
      if (!user) {
        await prisma.user.create({
          data: { phoneNumber: phone, chatId: userId, state: "waiting_for_fullname" }
        });
        await sendMessage(userId, "لطفاً نام و نام خانوادگی خود را ارسال کنید.");
        state.state = "";
        return NextResponse.json({ message: "User registered" });
      } else {
        console.log("hiii")
        await prisma.user.update({ where: { phoneNumber: phone }, data: { chatId: userId }});
        const memberships = await prisma.fundMembership.findMany({
          where: { userId: user.id },
          include: { fund: true }
        });
      
        let message = "✅ شما قبلاً ثبت‌نام شده اید.\n";
        message += "💼 صندوق‌های شما:\n";
          memberships.forEach(m => {
            message += `🔹 ${m.fund.name} - ${m.role === "ADMIN" ? "مدیر" : "عضو"}\n`;
        });
        await sendMessage(userId, message);
        await sendOptions(userId, true);
        state.state = "";
        return NextResponse.json({ message: "User already registered" });
      }
    }

    if (user?.state === "waiting_for_fullname") {
      await prisma.user.update({ where: { chatId: userId }, data: { fullName: text, state: "verified" } });
      await sendOptions(userId, true);
      return NextResponse.json({ message: "User verified" });
    }

    if (callbackData === "create_fund") {
      if (!user) {
        await sendMessage(userId, "❌ ابتدا باید شماره موبایل خود را ثبت کنید. لطفاً /start را ارسال کنید.");
        return NextResponse.json({ message: "User not registered" });
      }
      await prisma.user.update({ where: { chatId: userId }, data: { state: "waiting_for_fund_name" } });
      await sendMessage(userId, "🔹 لطفاً یک نام برای صندوق خود انتخاب کنید.");
      return NextResponse.json({ message: "Requesting fund name" });
    }

    if (user?.state === "waiting_for_fund_name") {
      const newFund = await prisma.fund.create({
        data: {
          name: text!,
          adminId: user.id,
          balance: 0,
        },
      });

      await prisma.fundMembership.create({
        data: {
          userId: user.id,
          fundId: newFund.id,
          role: "ADMIN",
          balance: 0,
        },
      });

      await prisma.user.update({ where: { chatId: userId }, data: { state: "verified" } });
      await sendMessage(userId, `✅ صندوق "${text}" ایجاد شد!`);
      await sendOptions(userId, true);
      return NextResponse.json({ message: "Fund created" });
    }

    return NextResponse.json({ message: "Unhandled message" });

  } catch (error: any) {
    console.error("Error in webhook:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     if (!body || (!body.message && !body.callback_query)) {
//       return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
//     }

//     const userId = body.message?.chat?.id || body.callback_query?.from?.id;
//     if (!userId) {
//       return NextResponse.json({ message: "User ID not found" }, { status: 400 });
//     }

//     let text = body.message?.text?.trim();
//     let callbackData = body.callback_query?.data;
    
//     let user = await prisma.user.findUnique({ where: { chatId: userId } });
//     let userPhoneVerified: any;

//     if (user?.state === "waiting_for_phone") {
//       await sendMessage(userId, "👋 لطفاً شماره موبایل خود را ارسال کنید.");
//       userPhoneVerified = await prisma.user.findUnique({ where: { phoneNumber: text } });
//       if (!user?.chatId) {
//         await prisma.user.update({ where: { phoneNumber: text }, data: { chatId: userId, state: "verified" } });
//         return NextResponse.json({ message: "User verified" });
//       }
//     }

//     if (user?.state === "member_added" && !user?.fullName) {
//       await prisma.user.update({ where: { chatId: userId }, data: { phoneNumber: text, state: "waiting_for_fullname" } });
//       await sendMessage(userId, "🔹 لطفاً نام و نام خانوادگی خود را ارسال کنید.");
//       return NextResponse.json({ message: "Requesting full name" });
//     }

//     if (text === "/start") {
//       if (!user) {
//         await sendMessage(userId, "👋 لطفاً شماره موبایل خود را ارسال کنید.");
//         await prisma.user.create({
//           data: { chatId: userId, state: "waiting_for_phone" }
//         });
//         return NextResponse.json({ message: "Requesting phone number" });
//       }
    
//       // دریافت لیست صندوق‌های کاربر و نقش‌ها
//       const memberships = await prisma.fundMembership.findMany({
//         where: { userId: user.id },
//         include: { fund: true }
//       });
    
//       let message = "✅ شما قبلاً ثبت‌نام کرده‌اید.\n";
//       if (memberships.length > 0) {
//         message += "💼 صندوق‌های شما:\n";
//         memberships.forEach(m => {
//           message += `🔹 ${m.fund.name} - ${m.role === "ADMIN" ? "مدیر" : "عضو"}\n`;
//         });
//       } else {
//         message += "❌ شما عضو هیچ صندوقی نیستید.";
//       }
    
//       await sendMessage(userId, message);
//       await sendOptions(userId, true);
//       return NextResponse.json({ message: "User already registered" });
//     }

//     if (user?.state === "waiting_for_phone" && /^09\d{9}$/.test(text!)) {
//       if (!user?.chatId) {
//         await prisma.user.update({ where: { phoneNumber: text }, data: { chatId: userId, state: "verified" } });
//         await sendOptions(userId, true);
//         return NextResponse.json({ message: "User verified" });
//       }

//       if (!userPhoneVerified?.phoneNumber) {
//         await prisma.user.update({ where: { chatId: userId }, data: { phoneNumber: text, state: "waiting_for_fullname" } });
//       }
//       await sendMessage(userId, "🔹 لطفاً نام و نام خانوادگی خود را ارسال کنید.");
//       return NextResponse.json({ message: "Requesting full name" });
//     }

//     if (user?.state === "waiting_for_fullname") {
//       await prisma.user.update({ where: { chatId: userId }, data: { fullName: text, state: "verified" } });
//       await sendOptions(userId, true);
//       return NextResponse.json({ message: "User verified" });
//     }

//     if (callbackData === "create_fund") {
//       if (!user) {
//         await sendMessage(userId, "❌ ابتدا باید شماره موبایل خود را ثبت کنید. لطفاً /start را ارسال کنید.");
//         return NextResponse.json({ message: "User not registered" });
//       }
//       await prisma.user.update({ where: { chatId: userId }, data: { state: "waiting_for_fund_name" } });
//       await sendMessage(userId, "🔹 لطفاً یک نام برای صندوق خود انتخاب کنید.");
//       return NextResponse.json({ message: "Requesting fund name" });
//     }

//     if (user?.state === "waiting_for_fund_name") {
//       const newFund = await prisma.fund.create({
//         data: {
//           name: text!,
//           adminId: user.id,
//           balance: 0,
//         },
//       });

//       await prisma.fundMembership.create({
//         data: {
//           userId: user.id,
//           fundId: newFund.id,
//           role: "ADMIN",
//           balance: 0,
//         },
//       });

//       await prisma.user.update({ where: { chatId: userId }, data: { state: "verified" } });
//       await sendMessage(userId, `✅ صندوق "${text}" ایجاد شد!`);
//       await sendOptions(userId, true);
//       return NextResponse.json({ message: "Fund created" });
//     }

//     return NextResponse.json({ message: "Unhandled message" });
//   } catch (error) {
//     console.error("Error in webhook:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

async function sendMessage(chatId: number, text: string) {
  const API_URL = `https://tapi.bale.ai/bot${process.env.BOT_TOKEN}/sendMessage`;
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function sendOptions(chatId: number, isRegistered: boolean) {
  const API_URL = `https://tapi.bale.ai/bot${process.env.BOT_TOKEN}/sendMessage`;
  const keyboard = isRegistered
    ? [
        [{ text: "🚀 ورود به مینی‌اپ", web_app: { url: `https://viona-graphy.ir/?chatId=${chatId}` } }],
        [{ text: "➕ ایجاد صندوق جدید", callback_data: "create_fund" }],
      ]
    : [[{ text: "➕ ایجاد صندوق جدید", callback_data: "create_fund" }]];

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: "👇 لطفا یک گزینه را انتخاب کنید:",
      reply_markup: { inline_keyboard: keyboard },
    }),
  });
}

async function sendHelloOptions(chatId: number) {
  const API_URL = `https://tapi.bale.ai/bot${process.env.BOT_TOKEN}/sendMessage`;
  const keyboard = [
    [{ text: "ارسال شماره موبایل", request_contact: true }]
  ];

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: "👇 لطفا یک گزینه را انتخاب کنید:",
      reply_markup: { keyboard: keyboard, resize_keyboard: true, one_time_keyboard: true },
    }),
  })
}
