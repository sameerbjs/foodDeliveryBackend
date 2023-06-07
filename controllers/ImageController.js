import multer from "multer";
import fs from 'fs'

const folderPath = 'uploads/resturant';
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

export const restProfileUpload = multer({ storage });
