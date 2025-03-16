'use client';

import { useAddMember } from '@/hooks/useMembers';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface AddMemberProps {
   onMemberAdded: () => void;
}

const AddMember = ({ onMemberAdded }: AddMemberProps) => {

   const { mutate: addMember, isPending } = useAddMember(() => onMemberAdded());

   const [formData, setFormData] = useState({
      name: "", phone: ""
   });

   const onSubmit = () => {
      if (!formData.name || !formData.phone) {
         toast.error("لطفا همه فیلد هارا پر کنید.")
      } else {
         addMember(formData)
      }
   };

  return (
    <div className='w-54 p-6'>
      <form onSubmit={onSubmit} className='space-y-4'>
         <input 
            value={formData.name}
            onChange={(e: any) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
            className="bg-gray-100 p-3 w-full rounded-lg border border-gray-100  placeholder:text-black text-black"
            placeholder="نام و نام خانوداگی"/>

         <input 
            value={formData.phone}
            onChange={(e: any) => setFormData((prev: any) => ({ ...prev, phone: e.target.value }))}
            className="bg-gray-100 p-3 w-full rounded-lg border border-gray-100  placeholder:text-black text-black"
            placeholder="شماره تلفن"/>

         <button className='w-full px-4 py-2 rounded-sm bg-indigo-600 text-white' type='submit'>{isPending ? "در حال افزودن" : "افزودن عضو"}</button>
      </form>
    </div>
  )
}

export default AddMember