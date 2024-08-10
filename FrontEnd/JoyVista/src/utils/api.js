/* eslint-disable no-unused-vars */
import axios from "axios";

const base_url = "http://localhost:8000";

export const fetchfromapi = async (url,params)=>{
    try {
        const {data} = await axios.get(base_url + url,{
            params,
        })
    
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const sendDataToapi = async (url,body)=>{
    try {
        const result = await axios.post(base_url + url,body,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return result;
    } catch (error) {
        console.log(error);
    }
}