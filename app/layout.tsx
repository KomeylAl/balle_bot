import SideBr from "@/components/SideBr";
import "./globals.css";
import { Metadata } from "next";

import favicon from '@/public/favicon.ico'; 

export const metadata: Metadata = {
  title: "صندوق نیکو"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative bg-gray-300 p-12 h-screen">
        <div className="w-[400px] h-[400px] fixed -z-10 -top-40 -right-40 bg-amber-200 rounded-full" />
        <div className="w-[400px] h-[400px] fixed -z-10 -bottom-40 -left-40 bg-indigo-300 rounded-full" />
        <div className="h-full w-full overflow-y-auto lg:flex rounded-2xl">
          <SideBr />
          {children}
        </div>
      </body>
    </html>
  );
}
