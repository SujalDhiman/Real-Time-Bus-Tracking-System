import {v2 as cloudinary}  from "cloudinary"
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary=async (localFilePath)=>{

    try {
        console.log("inside upload ",localFilePath )
        if(!localFilePath) return null;
        console.log("final path is not null")
        const response=await cloudinary.uploader.upload(localFilePath,
            {
                folder:"graphathon",
                resource_type:"image"
            })
        
        console.log("successfully uploaded")
        fs.unlinkSync(localFilePath)
        return response
        
    } catch (error) {
        return null
    }
}

const deleteFileFromCloudinary=async (fileURL)=>{

    try {

        if(!fileURL)
        return null

        const response=await cloudinary.uploader.destroy(fileURL)

        fs.unlinkSync(localFilePath)
        return response.result

    } catch (error) {
        console.log("something went wrong while deleting file ",error.message)
    }

}

export {uploadOnCloudinary,deleteFileFromCloudinary}