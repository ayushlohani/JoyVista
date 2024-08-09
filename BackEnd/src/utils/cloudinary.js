import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
    cloud_name: 'dmjwh7hb1', 
    api_key: '287684181859648', 
    api_secret: 'TUEhgDSiQbnDf1zisptCTaXT6M8'
});

const uploadonCloudinary = async (localurl)=>{
    try{
        const result = await cloudinary.uploader.upload(localurl,{
            resource_type:'auto'
        });

        fs.unlinkSync(localurl);
        return result;
    }
    catch(err){
        fs.unlinkSync(localurl);
        console.log(ere);
    }

}

export {uploadonCloudinary};
