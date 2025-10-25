import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    return cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1e7 },
});

export default upload;
