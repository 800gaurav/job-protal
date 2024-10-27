import multer from "multer";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});


const fileFilter = (req, file, cb) => {

  if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only .pdf, .png, .jpg, and .jpeg files are allowed!'), false); // Reject file
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter 
});

export default upload;
