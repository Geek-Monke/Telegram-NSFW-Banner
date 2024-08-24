'use client'

import React from 'react'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

function Nav() {

  const router = useRouter();

  return (
    <div className='top-0 left-0 flex justify-between px-12 pt-4'>
        <div className='flex gap-4'>
        <Button variant='secondary' onClick={() => router.push('/leaderboard')}>Leaderboard 🏆</Button>
        <Button variant='secondary'>Groups</Button>
        </div>
        <p>anonymous user</p>
    </div>
    )
}

export default Nav;