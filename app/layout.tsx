import SideBr from "@/components/SideBr";
import "./globals.css";
import { Metadata } from "next";
import Script from 'next/script'
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "گنجه نیکو"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><Script src="https://tapi.bale.ai/miniapp.js?1" /></head>
      <body className="relative bg-gray-300 p-6 md:p-12 h-screen">
        <Toaster />
        <div className="w-[400px] h-[400px] fixed -z-10 -top-40 -right-40 bg-amber-200 rounded-full" />
        <div className="w-[400px] h-[400px] fixed -z-10 -bottom-40 -left-40 bg-indigo-300 rounded-full" />
          <Providers>{children}</Providers>
      </body>
    </html>
  );
}