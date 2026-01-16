import React, { useEffect, useMemo } from 'react'
import { useState } from 'react'
import { useLoaderData } from 'react-router-dom';
import { MdArrowDropDown, MdSearch } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";

import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { FaStar } from "react-icons/fa6";


import productApi from '../services/api';
//taking data via props
const TableComp = ({loadedproducts}) => {
  
  
  const loadedproduct=useLoaderData()
  //to store products
  const [products,setproducts]=useState(loadedproducts);
 
  //to set filters
  const [filters,setfilters]=useState({
    title:"",
    brand:"",
    category:"",
    price:"",
    rating:""


  })

  //editing states
  //id to find which row is nor being edited
  const [editingId,seteditingId]=useState(null);
  //editing value
  const [editingValue,seteditingValue]=useState("");

  //filterchange handler
  const handlefilterChange=(key,value)=>{
    setfilters((prev)=>({...prev,[key]:value}))

  }
  //its derived state from filters
  //filtered produvt list based on filters selected will use usememo so that it will only recalculated and rerender the ui when the filters or products will change
  const filteredproducts=useMemo(()=>{
    return products.filter((p)=>{
      const matchtitle=!filters.title || p.title.toLowerCase().includes(filters.title.toLowerCase());
      const matchbrand=!filters.brand || p.brand===filters.brand;
      const matchcategory=!filters.category || p.category===filters.category;
      const matchprice=!filters.price || p.price.toString()===filters.price;
      const matchrating=!filters.rating||Math.floor(p.rating).toString()===filters.rating;

      return matchbrand && matchcategory && matchprice && matchrating && matchtitle;
    })
  },[products, filters])

  // we want to have drop down options based on the filterede products
  const filteroptions=useMemo(()=>{
    // we want to have arrays of all filters unique values and sorted from filteredproducts
    const options={
      brand:Array.from(new Set(filteredproducts.map(p=>p.brand))).sort(),
      category:Array.from(new Set(filteredproducts.map(p=>p.category))).sort(),
      price:Array.from(new Set(filteredproducts.map(p=>p.price))).sort((a,b)=>a-b),
      rating:Array.from(new Set(filteredproducts.map(p=>Math.floor(p.rating)))).sort((a,b)=>a-b)

    }
    return options
  },[filteredproducts])

//lets create handler when we will start to edit title
const handleEditstart=(p)=>{
  seteditingId(p.id);
  seteditingValue(p.title)
}
//when use will try to save by clicking outside or enter
const handleEditsave=async(id)=>{
  try{
  const updatedprod=await productApi.updatedProduct(id,{"title":editingValue});
  const newproducts=products.map(p=>(p.id===id)?updatedprod:p);
  console.log(newproducts)
  setproducts(newproducts);
  //so that the title can again become normla text instead of input
  seteditingId(null)}
  catch(err){
    //will use toast
    throw new Error("product nto updated")
  }

}
//Lets change the color of table headers if some filter is on
const isFilterActive=(key)=>{
  return filters[key]!=="";
}
//handler to delete products
const handleDelete=async(id)=>{
  try{
    await productApi.deleteProduct(id);
    const newproduct=products.filter(p=>p.id!=id);
    setproducts(newproduct)
  }
  catch(err){
    throw new Error("product not deleted ")
  }


}
//refersh filter btn handler
const handlerefresh=()=>{
  setfilters({
    title:"",
    brand:"",
    category:"",
    price:"",
    rating:""


  })
}

  return (<>
    <div className='pt-8   justify-end px-8 flex    '><div className='flex items-center gap-2 hover:text-red-600 text-red-700  cursor-pointer font-semibold text-sm hover:scale-[1.02]'><button className=' ' onClick={handlerefresh}><GrPowerReset className=' font-bold  text-[1rem] ' /> </button><span onClick={handlerefresh}className=''>Reset Filter</span></div></div>
    <div className=' rounded-xl border border-gray-200 shadow-sm  mt-4 overflow-hidden '>
     
      <div className='overflow-x-auto '>
        <table className='w-full text-left '>
          <thead >
            <tr className='border-b border-gray-200 bg-white/40'>
              <th className='px-6 py-7 text-sm text-gray-700 font-semibold'>
                <div className='relative inline-flex items-center gap-4 group'>
                  <span className='text-[0.92rem] text-gray-800 font-semibold font-stretch-105%'>Title</span>
                  <input 
                  className=' cursor-pointer  hover:border-1g hover:bg-blue-100/30 hover:border-blue-200 group focus:scale-[1.03] foucs:bg-white  relative outline-none bg-white/60 border px-4 pr-20 py-1 rounded-sm font-light border-gray-300 text-sm  text-gray-500  '
                  type="text"
                  placeholder='Filter by Title'
                  value={filters.title}
                  onChange={(e)=>handlefilterChange("title",e.target.value)}
                  >
                    
                  </input>
                  <FaSearch className='absolute right-2  text-gray-400 '/>
                </div>
              </th>
            <th className='px-8 py-6 text-sm text-gray-700 font-semibold'>
              <div className='relative inline-flex items-center gap-1 '>
                <span className={`text-[0.92rem]  font-semibold font-stretch-105 ${isFilterActive("brand")?"text-gray-400/70":"text-gray-800"}`}>Brand</span>
                {/* now slect will sit on top of the container clicking anywhere will open drop down */}
                <select value={filters.brand} className='absolute inset-0 opacity-0 cursor-pointer  ' onChange={(e)=>handlefilterChange("brand",e.target.value)}>
                  <option className='' value="">All Brands</option>
                  {filteroptions.brand.map(c=>(<option key={c} value={c}>
{c}
                  </option>
                ))}

                </select>
                {/*  so that arrow won't block the select  */}
                <MdArrowDropDown className=' text-xl pointer-events-none' />
              </div>
            </th>
            <th className='px-8 py-6 text-sm text-gray-700 font-semibold'>
            <div className='relative inline-flex items-center gap-1 '>
              {/* conditional class rendering using isfilteractive */}
                <span className={`text-[0.92rem]  font-semibold font-stretch-105 ${isFilterActive("category")?"text-gray-400/70":"text-gray-800"}`}>Categories</span>
                <select className='absolute inset-0 opacity-0 cursor-pointer  ' value={filters.category} onChange={(e)=>handlefilterChange("category",e.target.value)}>
                  <option value="">All Categories</option>
                  {filteroptions.category.map(c=>(<option key={c} value={c}>
{c}
                  </option>))}
                  

                </select>
                {/*  so that arrow won't block the select  */}
                <MdArrowDropDown className=' text-xl pointer-events-none' />
              </div>
            </th >
            <th className='px-8 py-6 text-sm text-gray-700 font-semibold'> <div className='relative inline-flex items-center gap-1 '>
                <span className={`text-[0.92rem]  font-semibold font-stretch-105 ${isFilterActive("price")?"text-gray-400/70":"text-gray-800"}`}>Price</span>
                <select className='absolute inset-0 opacity-0 cursor-pointer  ' value={filters.price} onChange={(e)=>handlefilterChange("price",e.target.value)}>
                  <option value="">Any Price</option>
                  {filteroptions.price.map(c=>(<option key={c} value={c}>
{c}
                  </option>))}
                </select>
                {/*  so that arrow won't block the select  */}
                <MdArrowDropDown className=' text-xl pointer-events-none' />
              </div></th>
            <th className='px-8 py-6 text-sm text-gray-700 font-semibold'>
            <div className='relative inline-flex items-center gap-1 '>
                <span className={`text-[0.92rem]  font-semibold font-stretch-105 ${isFilterActive("rating")?"text-gray-400/70":"text-gray-800"}`}>Rating</span>
                <select className='absolute inset-0 opacity-0 cursor-pointer  ' value={filters.rating} onChange={(e)=>handlefilterChange("rating",e.target.value)}>
                  <option value="">Any rating</option>
                  {filteroptions.rating.map(c=>(<option key={c} value={c}>
{c}
                  </option>))}
                </select>
                {/*  so that arrow won't block the select  */}
                <MdArrowDropDown className=' text-xl pointer-events-none' />
              </div>
            </th>
            <th className='px-8 py-6 text-sm text-gray-700 font-semibold'>
              <div className='text-[0.92rem] text-gray-800 font-semibold font-stretch-105%'>Actions</div>
            </th>
            </tr>
            
          </thead>
          <tbody className='bg-white/80 divide-y divide-gray-200'>
          {filteredproducts.length>0 ? (filteredproducts.map(p=>(<tr className='hover:bg-gray-100 transition-colors group ' key={p.id}>
            <td className='px-6 py-4 font-medium text-sm text-gray-900'>
              {editingId==p.id ?
              (
                <input 
                autoFocus
                type="text"
                value={editingValue}
                onChange={(e)=>seteditingValue(e.target.value)}
                onKeyDown={(e)=>e.key=="Enter"&&handleEditsave(p.id)}
                onBlur={(e)=>handleEditsave(p.id)}
                className='w-full px-2 py-1 border-2 border-blue-500 rounded focus:outline-none '></input>
                
              )
              
              :(
                <div className='flex items-center gap-1 hover:text-blue-600 cursor-pointer' onClick={()=>handleEditstart(p)}><span>{p.title}</span>
                <MdOutlineEdit className='opacity-0    text-gray-300 text-[16px] group-hover:opacity-100 transition-opacity' /></div>
              )
              }
              </td>
              {/* in api we were not having any brand value for groceries so for ui i kept the value for them "No Brand"
               */}
            <td className='px-8   py-4 text-sm text-gray-900'>{p.brand || "No Brand"}</td>
            <td className='px-8  font-medium py-4 text-[0.73rem] text-gray-900'><span className='px-[8px] py-[3px] bg-blue-400/20 rounded-full text-blue-800 '>{p.category}</span></td>
            <td className='px-8   font-semibold py-4 text-sm text-gray-900 '>${p.price}</td>
            <td className='px-8  flex gap-1 items-center  font-medium  py-5 text-yellow-500 text-sm '><FaStar  /><span >{p.rating.toFixed(1)}</span></td>
            <td>
              <div className='px-10  text-right font-medium  py-4 text-sm text-gray-900'>
                <button   onClick={()=>handleDelete(p.id)}>
                <RiDeleteBin6Fill className='text-red-300 group-hover:text-red-600/90 cursor-pointer  group-hover:scale-[1.1] text-[1.1rem]' />
                </button>
              </div>
            </td>
          </tr>))):
          <tr >
            <td colSpan={6} className='py-12 px-6'>
            <div className=' flex flex-col gap-2 items-center text-center'>
              <div className=' text-gray-300'>< MdSearch className='text-4xl'/></div>
              <div className='flex flex-col gap-0'>
                <p className='text-gray-500 text-[1.2rem] font-medium'>No results found</p>
                <p className='text-sm text-gray-400 tracking-normal '>Try adjusting your filters or reset them</p>
              </div>
              <div><button  className=" cursor-pointer hover:text-cyan-600/80 font-semibold text-[1.1rem] text-cyan-600"onClick={handlerefresh}>Reset Filters</button></div>
            </div>
            </td>
             </tr>}
          </tbody>
        </table>
        {/* foot */}
        <div className='px-6 py-3 tracking-wider text-xs border-t border-gray-200 text-gray-500 font-medium bg-white/20 flex justify-between'>
          <span> TOTAL PRODUCTS :{products.length}</span>
          <span>PRODUCTS SHOWING :{filteredproducts.length}</span>
        </div>
      </div>
    </div>
    </>
  )
}

export default TableComp