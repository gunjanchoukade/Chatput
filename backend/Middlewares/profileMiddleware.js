import multer from "multer"
import {CloudinaryStorage} from "multer-storage-cloudinary"
import {cloudinary} from "../Utils/utils.js"

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"profiles",
        allowed_formats:["jpg","jpeg","png","webp"]
    }
})

const upload = multer({storage:storage});
export default upload;