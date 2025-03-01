import React from 'react'

const Pill = ({
    text
}) => {
  return (
    <div className=' flex items-center justify-center w-[150px] text-center bg-white dark:bg-zinc-800 border rounded-full py-1'>
        <span className='text-[10px] text-primaryLight dark:text-primaryDark font-semibold'>{text}</span>
    </div>
  )
}

export default Pill