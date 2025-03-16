'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { TbLayoutDashboard } from 'react-icons/tb';

const items = [
   { title: "داشبورد", link: "/dashboard", icon: <TbLayoutDashboard /> },
   { title: "اعضاء", link: "/dashboard/members", icon: <TbLayoutDashboard /> },
   { title: "وام ها", link: "/dashboard/loans", icon: <TbLayoutDashboard /> },
   { title: "پرداخت ها", link: "/dashboard/payments", icon: <TbLayoutDashboard /> },
   { title: "گزارشات", link: "/dashboard/logs", icon: <TbLayoutDashboard /> },
];

const NavBar = () => {

   const pathname = usePathname();

  return (
    <div className='flex flex-col items-start gap-5'>
      {items.map((item: any) => (
         <div key={item.link} className='w-full'>
            <Link href={item.link} className={`flex items-center gap-3 text-lg text-gray-500 ${pathname === item.link && "text-indigo-600 font-bold"}`}>{item.icon} {item.title}</Link>
         </div>
      ))}
    </div>
  )
}

export default NavBar