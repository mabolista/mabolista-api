const { cloudinary } = require('./cloudinary');

const uploadImageCloudinary = async (reqFilePath, folder) => {
  const upload = await cloudinary.uploader.upload(
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

const deleteImageCloudinary = (cloudinaryId) => {
  const image = cloudinary.uploader.destroy(cloudinaryId, (err, result) => {
    if (err) {
      return err;
    }

    return result;
  });
  return image;
};

module.exports = { uploadImageCloudinary, deleteImageCloudinary };
