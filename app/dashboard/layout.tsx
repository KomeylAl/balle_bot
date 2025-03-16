import SideBr from "@/components/SideBr";
import "../globals.css";
import { Metadata } from "next";
import Script from 'next/script'

export const metadata: Metadata = {
  title: "گنجه نیکو"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
      <SideBr />
      {children}
    </main>
  );
}
