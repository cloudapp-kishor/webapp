const { createNewUser, getUserByEmail, getUserById, updateUserDetails } = require('../services/userService');

const createUserController = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0 || req.url.includes('?')) {
      return res.status(400).json({ message: 'Query parameters are not allowed in the URL.' });
    }
    if (req.headers.authorization) {
      return res.status(400).json({ message: 'Authorization should not be provided for this request.' });
    }
    const user = await createNewUser(req);
    const { id, first_name, last_name, email, account_created, account_updated } = user;
    res.status(201).json({first_name, last_name, email, account_created, account_updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserController = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0 || req.url.includes('?')) {
      return res.status(400).json({ message: 'Query parameters are not allowed in the URL.' });
    }
    if (Object.keys(req.body).length > 0 || Object.keys(req.query).length > 0) {
      return res.status(400).json({ message: 'GET request should not contain a payload' });
    }
    const user = await getUserById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUserController = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0 || req.url.includes('?')) {
      return res.status(400).json({ message: 'Query parameters are not allowed in the URL.' });
    }
    await updateUserDetails(req.user.email, req);
    res.status(204).json({ message: "User data updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createUserController,
  getUserController,
  updateUserController,
};
