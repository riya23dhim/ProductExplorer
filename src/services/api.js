import {defer} from "react-router-dom";

const STORAGE_KEY=import.meta.env.VITE_STORAGE_KEY
const INITIAL_URL=import.meta.env.VITE_INITIAL_URL

//FUNCTION TO ADD DATA IN LOCAL STOARGE
const setLocalData=(data)=>{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(data))
}
//Function to get data from local storage
const getLocalData=()=>{
    const data=localStorage.getItem(STORAGE_KEY);
    //if data is there then convert it into js obj else give empty list
    return data?JSON.parse(data):[]
}
//an object of functions mock api for getting data ,updating and deleting
const productApi={

    getProductData(){
        //this  will return a promise ,which will take some time using set timeout to show network delay
        //when ever we  will call this function first we try to get data locally if its not there or for very first time we will fetch it using api
        return new Promise((resolve,reject)=>{
            //here to create newtwork delay we will use settimeout  or we can use async await with set timeout 
            setTimeout(()=>{
                // localStorage.removeItem(STORAGE_KEY).......just to refetch all the elements from actual api after testing features
                const cached=getLocalData();
                if (cached.length>0){
                    resolve(cached)
                }
                else{
                    fetch(INITIAL_URL).then((response)=>{
                        if(!response.ok){
                            //will automatically reject promise and outer catch will catch it
                            throw new Error("failed to fetch data")
                        }
                        //will return a new promise with resolved value response.json 
                        
                         return response.json()
                    }).then((data)=>{
                        //will create  alsit of products object with only required data mentioned
                        const requiredData=data.products.map((p)=>({
                            id:p.id,
                            title:p.title,
                            brand:p.brand,
                            category:p.category,    
                            price:p.price,
                            rating:p.rating

                        }))
                        //set this data in local storage and call resolve to fullfill the promise
                        setLocalData(requiredData)
        
                        resolve(requiredData)
                    }

                    )
                    .catch((err)=>
                    reject(err)

                    )    
                }
            },1000)
        

    })
    }
    ,
    updatedProduct(id,update){
        return new Promise((resolve,reject)=>{
//network delay 
setTimeout(()=>{
    const data=getLocalData();
    //lets find the index of the updated product in array usig findindex
    const index=data.findIndex(p=>p.id==id)
    if(index===-1)throw new Error("product not found")
    const updated={...data[index],...update};
    data[index]=updated
    setLocalData(data)
    resolve(updated)
    },400)
        })
        
        
    },
    deleteProduct(id){
        return new Promise((resolve,reject)=>{
            //netwrork delay
            setTimeout(()=>{
                const data=getLocalData();
                const newdata=data.filter(p=>p.id!=id)
                setLocalData(newdata)
                resolve()
            },400)
        })
    },
    


}
const loader=async()=>{
    try{
        //it will return a promise object with key product 
   return defer({
    product:productApi.getProductData(),
   })
   
}
   catch(err){
    throw new Error("Server Error")
   }
   
}
export default productApi;
export {loader};
