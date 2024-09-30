const bcrypt = require('bcrypt');
const User = require('../models/userModel');


const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};


const createNewUser = async (userData) => {
  const { first_name, last_name, email, password } = userData;
  
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
  return User.findOne({ where: { email } });
};


const updateUserDetails = async (email, updatedData) => {

    const user = await User.findOne({ where: { email } });
    
    // Check if the user exists
    if (!user) {
      throw new Error('User not found');
    }
  
    // Destructure the fields you want to update
    const { first_name, last_name, password } = updatedData;
  
    // Update the fields only if they are provided
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (password) user.password = await hashPassword(password);
  
    // Save the updated user record and return it
    return user.save();
  };
  

const getUserById = async (id) => {
  return User.findByPk(id, {
    attributes: ['id', 'first_name', 'last_name', 'email', 'account_created', 'account_updated'],
  });
};

module.exports = {
  createNewUser,
  getUserByEmail,
  updateUserDetails,
  getUserById,
};
