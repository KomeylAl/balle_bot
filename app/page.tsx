'use client';

import { ComboboxDemo } from "@/components/ui/combo";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PuffLoader } from "react-spinners";

function HomePage() {
  const router = useSearchParams();
  const chatId = router.get("chatId");

  if (!chatId) {
    return (
      <Suspense fallback={<PuffLoader color="#3b82f6"/>}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="bg-white/70 backdrop-blur-xl w-96 h-96 flex items-center justify-center rounded-xl text-black p-8">
            <p className="text-center">آیدی شما پیدا نشد. مجددا تلاش کنید! <br /> این برنامه فقط از طریق اپلیکیشن بله و ربات گنجه نیکو به آدرس <Link href='https://bale.ai/@nikoo_bot' target="_blank" className="text-blue-500">@nikoo_bot</Link> در دسترس است.</p>
          </div>
        </div>
      </Suspense>
    );
  }

  const { data, isLoading, error } = useUser(chatId!);

  if (data) {
    console.log(data);
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white bg-white/70 backdrop-blur-xl w-96 h-96 flex items-center justify-center rounded-xl text-black p-8">

        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <PuffLoader color="#3b82f6" />
          </div>
        )}

        {error && (
          <p>خطا در دریافت اطلاعات کاربر</p>
        )}

        {data && (
          <div className="flex flex-col items-center justify-center gap-5 text-black">
            <p className="text-lg">خوش اومدی {data.fullName}👋</p>
            <ComboboxDemo funds={data.membership} />
          </div>
        )}
      </div>
    </div>
  );

}

export default function Home() {
  return (
    <Suspense fallback={<PuffLoader color="#3b82f6"/>}>
      <HomePage />
    </Suspense>
  );
}