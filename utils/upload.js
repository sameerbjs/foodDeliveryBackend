import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
dotenv.config();

const storage = new GridFsStorage({
    url: process.env.DB_CONNECT_URL,
    options: { useNewUrlParser: true },
    file: (request, file) => {
        return {
            bucketName: "uploads",
            filename: `${Date.now()}-blog-${file.originalname}`,
        };
    },
});

export default multer({ storage });
