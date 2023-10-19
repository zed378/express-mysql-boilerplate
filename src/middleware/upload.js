const multer = require("multer");

exports.profileImg = (img) => {
  // define upload folder destination
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // folder name to store artist image
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      // rename file upload with adding date as a firstname
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  // filtering image extension
  const fileFilter = (req, file, cb) => {
    // check if file is exist
    if (file.fieldname === img) {
      // define allowed extension
      if (
        !file.originalname.match(
          /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP|svg|SVG)$/
        )
      ) {
        // if did not match allow extension
        req.fileValidationError = {
          message: "Only image files are allowed",
        };
        return cb(new Error("Only image files are allowed"), false);
      }
    }
    cb(null, true);
  };

  // set max size image file
  const maxSize = 10 * 1024 * 1024;

  // call multer for upload single file
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single(img);

  return upload;
};
