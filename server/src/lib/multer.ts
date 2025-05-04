import multer from 'multer'

const sanitizeFilename = (filename: string) => {
    return filename.replace(/[^a-z0-9.]/gi, '_').toLowerCase(); 
};

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public')    
    },
    filename: (req, file, callBack) => {
        callBack(null, sanitizeFilename(file.originalname))
    }
})

export const upload = multer({
    storage: storage
});