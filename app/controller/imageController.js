const imageService = require('../services/imageService');

//Add profile pic
const addProfilePic = async (req, res) => {

  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  }
  
  try {
    const userId = req.user.id; 
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Profile picture file is required' });
    }

    // Check if the user already has a profile picture
    const existingImageData = await imageService.getImage(userId);
    if (existingImageData) {
      return res.status(400).json({ message: 'You already have a profile picture uploaded. Please delete it before uploading a new one.' });
    }

    const imageData = await imageService.uploadImage(file.buffer, file.originalname, userId);
    res.status(201).json(imageData);
  } catch (error) {
    if (error instanceof multer.MulterError || error.message.includes('Only jpg, jpeg, and png files are allowed.')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

//Get profile pic
const getProfilePic = async (req, res) => {

  if (Object.keys(req.body).length > 0) {
    return res.status(400).json({ message: 'GET request should not contain a body.' });
  }

  try {
    const userId = req.user.id;
    const imageData = await imageService.getImage(userId);

    if (!imageData) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    res.status(200).json(imageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete profile pic
const deleteProfilePic = async (req, res) => {

  if (Object.keys(req.body).length > 0) {
    return res.status(400).json({ message: 'DELETE request should not contain a body.' });
  }

  try {
    const userId = req.user.id;
    await imageService.deleteImage(userId);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Image not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  addProfilePic,
  getProfilePic,
  deleteProfilePic,
};
