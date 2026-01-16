import React from "react";
import { useLoaderData ,Await } from "react-router-dom";
import { Suspense } from "react";
import SkeletonLoader from "../component/SkeletonLoader";
import Error from "../component/Error";
import TableComp from "../component/TableComp";


const TablePage = () => {
    //PROMISE RETURNED BY DEFER 
    const {product}=useLoaderData()
  return (
    //WAIT FOR PROMISE TO RESOLVE TILL THEN SHOW FALLBACK ELEMENT AND WHEN RESOLVED PASS THE RESOLVED DATA TO MAIN TABLE COMPONENT
    <Suspense fallback={<SkeletonLoader/>}>
        {/* resolve the promise if failed show error elememt else resolved than pass the data to arrow function and table comp */}
        <Await resolve={product} errorElement={<Error/>}>
        {/* passing data to table comp as props */}
        {(loadedproducts)=>(<TableComp loadedproducts={loadedproducts}/>)}

        </Await>

    </Suspense>
  )
}

export default TablePage