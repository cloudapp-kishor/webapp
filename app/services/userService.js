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

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};


const createNewUser = async (req) => {

  if (!req.is('application/json')) {
    throw new Error('Request body must be in JSON format');
  }

  const { first_name, last_name, email, password, ...extraFields } = req.body;
  //console.log("password:", password)

  if (!first_name || !last_name || !password || !email || Object.keys(extraFields).length > 0) {
    throw new Error("Invalid Request Body");
  }

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (typeof first_name !== 'string' || typeof last_name !== 'string' || typeof password !== 'string') {
      throw new Error("Name and Password must be String");
  }

  if (!isValidPassword(password)) {
    throw new Error('Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
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


const updateUserDetails = async (email, req) => {

    if (!req.is('application/json')) {
      throw new Error('Request body must be in JSON format');
    }

    const user = await User.findOne({ where: { email } });

    //console.log("dataToUpdate:", dataToUpdate)
    
    // Check if the user exists
    if (!user) {
      throw new Error('User not found');
    }
  
    // Destructure the fields you want to update
    const { first_name, last_name, password, ...extraFields } = req.body;

    if (Object.keys(extraFields).length > 0) {
      throw new Error('You cannot update fields other than firstname, lastname or password');
    }

    if ( !first_name || !last_name || !password ) {
      throw new Error('Please provide all the required fields');
    }

    if ( (first_name && typeof first_name !== 'string') || (last_name && typeof last_name !== 'string') || (password && typeof password !== 'string')) {
      throw new Error('Name and Password must be String');
    }

    if (!isValidPassword(password)) {
      throw new Error('Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
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
};
