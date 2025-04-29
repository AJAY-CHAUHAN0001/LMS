import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({});

cloudinary.config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME
})

export const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type: 'auto'
        })

        return uploadResponse;
    } catch (error) {
        console.log(error);
    }
}

export const deleteMediaFromCloudinary = async (mediaUrlOrPublicId) => {
    try {
        let publicId = mediaUrlOrPublicId;

        // if it's a full URL, extract the publicId
        if (mediaUrlOrPublicId.includes("cloudinary.com")) {
            const parts = mediaUrlOrPublicId.split("/upload/");
            if (parts[1]) {
                const withoutVersion = parts[1].split("/");
                // remove version if starts with 'v'
                if (withoutVersion[0].startsWith("v")) {
                    withoutVersion.shift();
                }
                const fullPath = withoutVersion.join("/");
                publicId = fullPath.split(".")[0]; // remove .jpg/.png etc
            }
        }

        await cloudinary.uploader.destroy(publicId);

    } catch (error) {
        console.log(error);
    }
}

export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });

    } catch (error) {
        console.log(error);
    }
}

