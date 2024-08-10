import { useEffect, useState } from "react"
import { sendDataToapi } from "../utils/api";

export const usePost = (url,body)=>{
    const [res,setres] = useState(null);
    const [loading,setloading] = useState(false);
    const [error,seterror] = useState(null);

    useEffect(()=>{
        setloading(true);
        
        sendDataToapi(url).then((res)=>{
            setloading(false);
            setres(res);
        }).catch((err)=>{
            setloading(false);
            seterror(err);
        })
    },[url,body]);

    return {res,loading,error};
}