'use client';

import { useMembers } from '@/hooks/useMembers';
import React, { useState } from 'react';
import { PuffLoader } from 'react-spinners';
import { TiPlus } from "react-icons/ti";
import Header from '@/components/Header';
import Popup from '@/components/ui/popup';
import AddMember from '@/components/AddMember';
import MemberItem from '@/components/MemberItem';

const Members = () => {

  const { data, isLoading, error, refetch } = useMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-full text-white bg-white/70 backdrop-blur-xl w-full overflow-y-auto text-black p-8 space-y-5">

      <Header title='اعضاء'/>

      <div className='w-full'>
        <button
          onClick={() => setIsModalOpen(true)} 
          className='px-4 py-2 bg-indigo-600 text-white rounded-sm flex items-center justify-center gap-2'>
          افزودن عضو <TiPlus size={20}/>
        </button>
      </div>

      {error && (
        <p>خطا در دریافت اطلاعات صندوق</p>
      )}

      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <PuffLoader color="#3b82f6" />
        </div>
      )}

      {data && (
        data.map((member: any) => (
          <MemberItem member={member} key={member.id} />
        ))
      )}

      <Popup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddMember 
          onMemberAdded={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      </Popup>
    </div>
  )
}

export default Members