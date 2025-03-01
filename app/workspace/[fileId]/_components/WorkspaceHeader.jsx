import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

const WorkspaceHeader = ({
  fileName
}) => {
  return (
    <div className='p-4 flex justify-between items-center shadow-md'>
        <Image src="/logo.svg" alt="Vercel Logo" width={170} height={170}/>
        <h2 className='font-bold text-xl'>{fileName}</h2>
        <UserButton />  
    </div>
  )
}

export default WorkspaceHeader