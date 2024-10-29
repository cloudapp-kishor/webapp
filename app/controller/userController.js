const { createNewUser, getUserByEmail, getUserById, updateUserDetails } = require('../services/userService');
const {logger} = require('../logger');

const createUserController = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0 || req.url.includes('?')) {
      logger.warn(`User creation failed: Query parameters are not allowed in the URL for ${req.url}.`);
      return res.status(400).json({ message: 'Query parameters are not allowed in the URL.' });
    }
    if (req.headers.authorization) {
      logger.warn(`User creation failed: Authorization should not be provided for this request.`);
      return res.status(400).json({ message: 'Authorization should not be provided for this request.' });
    }
    const user = await createNewUser(req);
    const { id, first_name, last_name, email, account_created, account_updated } = user;
    logger.info(`New user created: ${first_name} ${last_name} (ID: ${id})`);
    res.status(201).json({first_name, last_name, email, account_created, account_updated });
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

const getUserController = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0 || req.url.includes('?')) {
      logger.warn(`User retrieval failed: Query parameters are not allowed in the URL for ${req.url}.`);
      return res.status(400).json({ message: 'Query parameters are not allowed in the URL.' });
    }
    if (Object.keys(req.body).length > 0 || Object.keys(req.query).length > 0) {
      logger.warn(`User retrieval failed: GET request should not contain a payload.`);
      return res.status(400).json({ message: 'GET request should not contain a payload' });
    }
    const user = await getUserById(req.user.id);
    logger.info(`User retrieved successfully: ${user.first_name} ${user.last_name} (ID: ${req.user.id})`);
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error retrieving user: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

const updateUserController = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0 || req.url.includes('?')) {
      logger.warn(`User update failed: Query parameters are not allowed in the URL for ${req.url}.`);
      return res.status(400).json({ message: 'Query parameters are not allowed in the URL.' });
    }
    await updateUserDetails(req.user.email, req);
    logger.info(`User data updated successfully for email: ${req.user.email}`);
    res.status(204).json({ message: "User data updated" });
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createUserController,
  getUserController,
  updateUserController,
};
