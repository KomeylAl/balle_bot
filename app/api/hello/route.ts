import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || !message.peer || !message.text) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const userId = message.peer.peerId;
    const text = message.text.trim();

    // بررسی اینکه آیا پیام "/start" هست یا نه
    if (text === "/start") {
      await sendWelcomeMessage(userId);
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Error in webhook:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// تابع ارسال پیام خوش‌آمدگویی به کاربر
async function sendWelcomeMessage(userId: any) {
  const BOT_TOKEN = process.env.BOT_TOKEN; // توکن بازو را در .env قرار بده
  const API_URL = `https://tapi.bale.ai/bot${BOT_TOKEN}/sendMessage`;

  const messageData = {
    chat_id: userId,
    text: "👋 سلام! به بازوی مدیریت صندوق‌های خانوادگی خوش آمدید. لطفاً از منو گزینه‌های موردنظر خود را انتخاب کنید.",
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      console.error("Failed to send message:", await response.text());
    }
  } catch (error) {
    console.error("Error sending welcome message:", error);
  }
}
