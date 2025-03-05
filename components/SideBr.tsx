'use client';

import Image from 'next/image';
import React from 'react';
import NavBar from './NavBar';

const SideBr = () => {
  return (
    <div className='hidden lg:flex max-h-screen w-72 border-l border-gray-300 bg-white/70 backdrop-blur-xl flex-col items-start justify-between p-5'>
      <div className='flex flex-col gap-8'>
      <Image 
         src='/images/logo.png'
         alt='logo'
         width={200}
         height={80}
      />
      <NavBar />
      </div>
      <div className='w-full text-center'>
         version 1.0
      </div>
    </div>
  )
}

export default SideBr