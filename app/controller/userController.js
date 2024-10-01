const { createNewUser, getUserByEmail, getUserById, updateUserDetails } = require('../services/userService');

const createUserController = async (req, res) => {
  try {
    const user = await createNewUser(req.body);
    const { id, first_name, last_name, email, account_created, account_updated } = user;
    res.status(201).json({first_name, last_name, email, account_created, account_updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserController = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUserController = async (req, res) => {
  try {
    await updateUserDetails(req.user.email, req.body);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createUserController,
  getUserController,
  updateUserController,
};
