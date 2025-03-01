import Image from 'next/image';
import React from 'react'


const Demo = () => {
  return (
    <div className="[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)] relative py-20 md:py-40 lg:py-50">
      <div
        className="relative max-w-xl mx-auto p-1 rounded-2xl
            border-2 border-primaryDark shadow-lg shadow-primaryDark/50
            "
      >
        <Image 
            src={'/demo.gif'}
            width={800}
            height={800}
            alt='demo'
            className='rounded-xl'
        />
      </div>
    </div>
  );
}

export default Demo