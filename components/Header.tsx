'use client';

import { useFund } from '@/hooks/useAccount';
import React, { useState } from 'react';
import { CgMenuRight } from 'react-icons/cg';
import { PuffLoader } from 'react-spinners';
import MobileNav from './MobileNav';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {

   const { data, isLoading, error } = useFund();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div>
      {error && (
        <p>خطا در دریافت اطلاعات صندوق</p>
      )}

      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <PuffLoader color="#3b82f6" />
        </div>
      )}

      {data && (
        <div className='w-full flex items-center gap-5'>
          <CgMenuRight color='#000000' size={20} onClick={toggleMenu}/>
          <MobileNav isOpen={isMenuOpen} />
          <h2 className='text-center font-semibold text-xl text-black'>{data.name} - {title}</h2>
        </div>
      )}
    </div>
  )
}

export default Header