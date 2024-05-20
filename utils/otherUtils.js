const fs = require("fs");

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

module.exports = { sanitizeFields, generateOTP, deleteLocalFile };
