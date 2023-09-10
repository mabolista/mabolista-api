const { cloudinary } = require('./cloudinary');

const uploadImageCloudinary = (reqFilePath, folder) => {
  const upload = cloudinary.uploader.upload(
    reqFilePath,
    { folder },
    (err, result) => {
      if (err) {
        return err;
      }

      return result;
    }
  );
  return upload;
};

module.exports = { uploadImageCloudinary };
