 
import axios from "axios";

const base_url = "http://localhost:8000/api/v1";

export const fetchfromapi = async (url,params)=>{
    try {
        const {data} = await axios.get(base_url + url,{
            params,
            withCredentials: true // Ensure cookies are getting with the request (Imp)
        })
    
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const sendDataToapi = async (url,body,header)=>{
    try {
        const result = await axios.post(base_url + url,body,{
            headers: {
                'Content-Type': header || 'multipart/form-data',
            },
            withCredentials:true, // Ensure cookies are sent with the request (Imp)
        });
        return result;
    } catch (error) {
        console.log(error);
    }
}