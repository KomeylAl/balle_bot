import React from 'react';

interface MemberItemProps {
   member: any;
}

const MemberItem = ({ member }: MemberItemProps) => {
  return (
    <div className='w-full flex flex-row bg-white rounded-md mb-3'>
      <div className='basis-1/2 text-right text-black p-3'>{member.fullName}</div>
      <div className='basis-1/2 text-right text-black p-3'>{member.phoneNumber}</div>
    </div>
  )
}

export default MemberItem