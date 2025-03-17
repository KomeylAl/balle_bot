'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { TbLayoutDashboard } from 'react-icons/tb';
import { MdOutlinePeopleOutline } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { MdOutlinePayments } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { IoMdArrowRoundBack } from "react-icons/io";

const items = [
   { title: "داشبورد", link: "/dashboard", icon: <TbLayoutDashboard /> },
   { title: "اعضاء", link: "/dashboard/members", icon: <MdOutlinePeopleOutline /> },
   { title: "وام ها", link: "/dashboard/loans", icon: <GrMoney /> },
   { title: "پرداخت ها", link: "/dashboard/payments", icon: <MdOutlinePayments /> },
   { title: "گزارشات", link: "/dashboard/logs", icon: <TbReportAnalytics /> },
   { title: "انتخاب صندوق", link: "/", icon: <IoMdArrowRoundBack /> },
];

const NavBar = () => {

   const pathname = usePathname();
   const router = useRouter();

  return (
    <div className='flex flex-col items-start gap-5'>
      {items.map((item: any) => (
         <div key={item.link} className='w-full' onClick={() => item.link === "/" && router.back()}>
            <Link href={item.link !== "/" ? item.link : ""} className={`flex items-center gap-3 text-lg text-gray-500 ${pathname === item.link && "text-indigo-600 font-bold"}`}>{item.icon} {item.title}</Link>
         </div>
      ))}
    </div>
  )
}

export default NavBar