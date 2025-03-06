'use client'

import React from 'react'
import { toast } from 'sonner'
import PricingCards from './_components/PricingCards'
import WhatYouGet from './_components/WhatYouGet'
import { useUser } from '@clerk/nextjs'

const UpgradePlans = () => {
  const user = useUser();

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-5xl font-bold text-center mt-2">
          <span className="text-primaryLight dark:text-primaryDark">
            Flexible {""}
          </span>
          Pricing to Suit Every Need
        </h2>
      </div>

      
        <WhatYouGet />


      <PricingCards user={user}/>
    </div>
  );
}

export default UpgradePlans