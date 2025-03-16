import React from 'react';
import NavBar from './NavBar';

interface MobileNavProps {
   isOpen: boolean;
}

const MobileNav = ({ isOpen }: MobileNavProps) => {
  return (
    <div className={`w-72 bg-white fixed top-20 right-10 p-6 rounded-lg ${isOpen ? "block" : "hidden"} z-30`}>
      <NavBar />
    </div>
  )
}

export default MobileNav