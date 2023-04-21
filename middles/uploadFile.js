var multer = require('multer');
const path = require('path');

function uploadFile(req, res, next) {
  let filename = '';

  let fullPath = path.resolve(__dirname, '../uploads');
  console.log(fullPath);
  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('destination:', file);

      cb(null, 'public/uploads');
    },

    filename: (req, file, cb) => {
      console.log('filename:', file);

      let extname = path.extname(file.originalname);
      filename = file.fieldname + '-' + Date.now() + extname;
      cb(null, filename);
    },
  });
  let upload = multer({ storage: storage }).single('file');
  upload(req, res, err => {
    console.log(req.file);
    if (err instanceof multer.MulterError) {
      res.send('multererr:' + err);
      console.log('multererr:' + err);
      return false;
    } else if (err) {
      res.send('err:' + err);
      return false;
    } else {
      req.body.photo = filename;
      console.log({ filesuccess: req.file });
      next();
    }
  });
}
module.exports = {
  uploadFile: uploadFile,
};
