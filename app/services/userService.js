const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const validator = require('validator');


const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const isValidEmail = (email) => {
  return validator.isEmail(email);
};


const createNewUser = async (userData) => {
  const { first_name, last_name, email, password, ...extraFields } = userData;
  //console.log("password:", password)

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!first_name || !last_name || !password || !email || Object.keys(extraFields).length > 0) {
    throw new Error("Invalid Request Body");
  }

  if (typeof first_name !== 'string' || typeof last_name !== 'string' || typeof password !== 'string') {
      throw new Error("Name and Password must be String");
  }
  
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const hashedPassword = await hashPassword(password);
  return User.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });
};

const getUserByEmail = async (email) => {
  return User.findOne( {where: { email } });
};


const updateUserDetails = async (email, dataToUpdate) => {

    const user = await User.findOne({ where: { email } });

    //console.log("dataToUpdate:", dataToUpdate)
    
    // Check if the user exists
    if (!user) {
      throw new Error('User not found');
    }
  
    // Destructure the fields you want to update
    const { first_name, last_name, password, ...extraFields } = dataToUpdate;

    if (Object.keys(extraFields).length > 0) {
      throw new Error('You cannot update fields other than firstname, lastname or password');
    }

    if ( (first_name && typeof first_name !== 'string') || (last_name && typeof last_name !== 'string') || (password && typeof password !== 'string')) {
      throw new Error('Name and Password must be String');
    }
  
    // Update the fields only if they are provided
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (password) user.password = await hashPassword(password);

    user.account_updated = new Date();
  
    // Save the updated user record and return it
    return user.save();
  };
  

const getUserById = async (id) => {
  return User.findByPk(id, {
    attributes: ['first_name', 'last_name', 'email', 'account_created', 'account_updated'],
  });
};

module.exports = {
  createNewUser,
  getUserByEmail,
  updateUserDetails,
  getUserById,
  getUserByEmail
};
