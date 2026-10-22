const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (
  buffer,
  folder,
  resourceType
) => {
  return new Promise((resolve, reject) => {

    console.log(
      "\n========== CLOUDINARY UPLOAD =========="
    );

    console.log("Folder:", folder);
    console.log("Resource Type:", resourceType);
    console.log("Buffer Size:", buffer.length);

    const options = {
      resource_type: resourceType,
      timeout: 120000,
    };

    if (folder) {
      options.folder = folder;
    }

    console.log(
      "Upload Options:",
      options
    );

    const uploadStream =
      cloudinary.uploader.upload_stream(
        options,

        (error, result) => {

          if (error) {

            console.error(
              "\n========== CLOUDINARY RAW ERROR =========="
            );

            console.dir(error, {
              depth: null,
            });

            reject(error);

            return;
          }

          console.log(
            "\n========== CLOUDINARY SUCCESS =========="
          );

          console.log(
            "URL:",
            result.secure_url
          );

          console.log(
            "Public ID:",
            result.public_id
          );

          resolve(result);
        }
      );

    uploadStream.end(buffer);
  });
};

module.exports = uploadToCloudinary;