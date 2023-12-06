const bcrypt = require('bcrypt');

const passwordHashing = async (plainText) => {
  const salt = await bcrypt.genSalt(10);

  const hashed = await bcrypt.hash(plainText, salt);

  return hashed.toString();
};

const passwordCompare = async (password, userPassword) => {
  const result = await bcrypt.compare(password, userPassword);

  return result;
};

module.exports = { passwordHashing, passwordCompare };
