const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const sanitizeFields = (allowedFields, requestBody) => {
  const sanitizedFields = {};
  if (Object.keys(requestBody).length !== 0) {
    allowedFields.map((field) => {
      if (requestBody[field] !== null && requestBody[field] !== undefined) {
        sanitizedFields[field] = requestBody[field];
      }
    });
    return sanitizedFields;
  }
};

const generateOTP = () => Math.floor(Math.random() * 900000) + 100000;

const deleteLocalFile = (imagePath) => {
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    // /Does file exists?
    if (err) return;

    // Delete the file
    fs.unlink(imagePath, (err) => {
      // Error in deleting the file
      if (err) return;

      // File deleted successfully!
      return;
    });
  });
};

const deleteFile = (imagePath) => {
  const filePath = path.join(__dirname, `../public/${imagePath}`);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    // /Does file exists?
    if (err) return;

    // Delete the file
    fs.unlink(filePath, (err) => {
      // Error in deleting the file
      if (err) return;

      // File deleted successfully!
      return;
    });
  });
};

const convertToJpeg = (inputFilePath, outputFilePath) => {
  inputFilePath = path.join(__dirname, `../public/${inputFilePath}`);
  outputFilePath = path.join(__dirname, `../public/${outputFilePath}`);

  return new Promise((resolve, reject) => {
    fs.readFile(inputFilePath, (err, data) => {
      if (err) {
        reject("Error reading file:", err);
        return;
      }

      sharp(data)
        .toFormat("jpeg")
        .toFile(outputFilePath, (err, info) => {
          if (err) {
            reject("Error converting file to JPEG:", err);
          } else {
            deleteFile(inputFilePath);
            resolve(info.format);
          }
        });
    });
  });
};

module.exports = { sanitizeFields, generateOTP, deleteLocalFile, deleteFile, convertToJpeg };
