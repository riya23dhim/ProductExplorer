import React from 'react';

import { Outlet } from 'react-router-dom';


const Applayout = () => {

 

  return (
    <div className='max-w-7xl mx-auto px-20 py-14'>
      {/* header */}
      <header className='flex justify-between items-center rounded-xl py-8 px-6 bg-white/40 backdrop-blur-2xl shadow-xs border-white/20'>
        <div className='flex gap-4 justify-center items-center'>
          <div className='hover:scale-[1.05] '><img className=" h-[3rem] w-[3rem] rounded-md "  src="./logo2.png" alt="Avatar"/></div>
          <div className='text-2xl text-gray-600 font-bold '>
            Product Explorer
          </div>
        </div>
        <div className='flex justify-center items-center gap-4'>
          <div className='flex flex-col text-right'>
            <p className='text-[0.8rem] font-bold'>Adminstrator</p>
            <p className='text-[0.7rem] font-semibold text-cyan-600  '>  Manage Account</p>
          </div>
          <div><img className=" h-[2.5rem] w-[2.5rem] rounded-full border-2 border-blue-300 hover:border-blue-400 hover:scale-[1.06]"src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"/></div>
        </div>

      </header>
      {/* table */}
      
      <Outlet/>
    </div>
  )
}

export default Applayout