import React from 'react'
import { SignIn,UserButton } from '@clerk/clerk-react';

function SignedInPage() {
  return (
    <div className='flex justify-between items-center mx-140 my-30'>
     <SignIn/>
    </div>
  )
}

export default SignedInPage