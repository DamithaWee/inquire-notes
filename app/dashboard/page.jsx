'use client'

import { api } from '@/convex/_generated/api';
import { SignOutButton, useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Dashboard = () => {

  const  {user} = useUser();
  const fileList = useQuery(api.fileStorage.getUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress
  })

  return (
    <div>
        <h2 className='font-medium text-3xl'>Workspace</h2>

      
        <div className='flex flex-col gap-5 mt-10'>
          {fileList?.length>0?fileList?.map((file, index) => (
            <Link
              href= {`/workspace/${file.fileId}`}
              key={index}
            >
              <div 
                className='flex gap-5 p-5 shadow-md rounded-md border cursor-pointer
                hover:bg-slate-100 hover:scale-[101%] transition duration-300
                '
              >
                <Image 
                  src={'/pdf.png'}
                  width={50}
                  height={50}
                  alt='pdf icon'
                />

                <div className='flex items-center justify-between w-full '>
                  <h2
                  className='font-medium text-lg'
                  >
                    {file.fileName}
                  </h2>
                  <h2
                  className='text-zinc-800/50'
                  >
                    {new Date(file._creationTime).toLocaleString()}
                  </h2>
                </div>
              </div>
            </Link>
          ))
          :[1,2,3,4,5].map((item, index) =>(
            <div
              key={index}
              className='bg-slate-200 rounded-md h-[100px] animate-pulse'
            >
            </div>
          ))
        }
        </div>


    </div>
  )
}

export default Dashboard