'use client';

import { useFund } from '@/hooks/useAccount';
import React, { useState } from 'react'
import { PuffLoader } from 'react-spinners';
import { CgMenuRight } from "react-icons/cg";
import MobileNav from '@/components/MobileNav';
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoMdArrowRoundUp } from "react-icons/io";
import Header from '@/components/Header';

const Dashboard = () => {

  const { data, isLoading, error } = useFund();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
   <div className="h-full text-white bg-white/70 backdrop-blur-xl w-full overflow-y-auto text-black p-8 space-y-5">

      <Header />

      <div className='w-full flex items-center gap-3'>
        <button className='flex-1 px-4 py-2 bg-indigo-600 text-white rounded-sm flex items-center justify-center gap-2'>واریز <IoMdArrowRoundDown size={20}/></button>
        <button className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-sm flex items-center justify-center gap-2'>برداشت <IoMdArrowRoundUp size={20}/></button>
      </div>

      <div className='w-full p-4 bg-white text-black rounded-sm text-center space-y-4'>
        <p className=''>موجودی کل صندوق</p>
        <p className='text-lg font-semibold'>0 ریال</p>
      </div>
    </div>
  )
}

export default Dashboard;