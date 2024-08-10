/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { fetchfromapi } from "../utils/api";

export const useFetch = (url,params)=>{
    const [data,setdata] = useState(null);
    const [loading,setloading] = useState(false);
    const [error,seterror] = useState(null);

    useEffect(()=>{
        setloading(true);
        setdata(null);
        seterror(null);

        fetchfromapi(url,params).then((res)=>{
            setloading(false);
            setdata(res);
        }).catch((err)=>{
            setloading(false);
            seterror(err);
        })
    },[url,params]);

    return {data,loading,error};
}