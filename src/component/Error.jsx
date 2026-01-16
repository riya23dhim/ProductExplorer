import React from 'react'

const Error = () => {
  return (
    <div className='mt-20 rounded-xl bg-white/90 shadow-xl shadow-gray'
    ><div className='flex px-10 py-10 flex-col gap-4 items-center justify-center '>
      <div className='h-40 '>    <img className="h-full" src="./five.png"></img></div>
  
      <div className='text-center px-40 font-medium text-gray-400'>Data could not be loaded ! Please retry again in few minutes.</div>
       <div className='mt-6'>
        <button className='px-5 py-2 hover:bg-cyan-800/60 hover:ring-cyan-800/45 cursor-pointer hover:scale-[1.02] hover:drop-shadow-xl hover:shadow-cyan-900 bg-cyan-800/50 ring-3 text-md rounded-md  ring-cyan-800/65 ring-offset-1 text-white'
        // to reload th page
        onClick={()=>window.location.reload()}>
          Retry
          
        </button>
       </div>
      </div>
      </div>
  )
}

export default Error