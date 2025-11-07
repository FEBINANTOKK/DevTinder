const validator = require("validator");

const isValidateData = (req) => {
  const { firstName, emailId, password } = req.body;

  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("Name is not Valid uuuu !!!!!!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not Valid uuu  !!!!!!!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not Valid uuu !!!!!!!");
  }
};
const validateEditProfileData = (req) => {
  const allowedEdit = ["firstName", "photoUrl", "about", "skills", "age"];
  const isValidate = Object.keys(req.body).every((field) =>
    allowedEdit.includes(field)
  );
  return isValidate;
};

const isStrongPassword = (newPassword) => {
  return validator.isStrongPassword(newPassword);
};
module.exports = {
  isValidateData,
  validateEditProfileData,
  isStrongPassword,
};
