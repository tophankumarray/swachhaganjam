const express = require('express');
const router = express.Router();
const db = require('../models');
const MachineryDefect = db.MachineryDefect;
const QueueFulfillment = db.QueueFulfillment;
const MoKhata = db.MoKhata;
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this is present
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


router.post('/machinery-defect', authMiddleware('supervisor'), async (req, res) => {
  const { supervisorName, contactNumber, machineName, description, photo } = req.body;

  let defectImageUrl = null;

  try {
    if (photo) {
      const base64Data = photo.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const fileName = `${uuidv4()}.jpg`;

      const uploadPath = path.join('/home/complaint-system/uploads', fileName);

      const dirPath = path.dirname(uploadPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFileSync(uploadPath, buffer);

      defectImageUrl = `https://sas.briskode.online/uploads/${fileName}`;
    }
    else if (req.file) {
      defectImageUrl = `https://sas.briskode.online/uploads/${req.file.filename}`;
    }

    const machineryDefect = await MachineryDefect.create({
      supervisorId: req.user.id,
      supervisorName,
      contactNumber,
      machineName,
      description,
      photo: defectImageUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Machinery defect reported successfully',
      machineryDefect,
    });
  } catch (error) {
    console.error('Error creating machinery defect:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report machinery defect',
      error: error.message,
    });
  }
});

// GET Machinery Defects
router.get('/machinery-defects', authMiddleware(['supervisor']), async (req, res) => {
  try {
    const defects = await MachineryDefect.findAll({ where: { supervisorId: req.user.id } });
    res.status(200).json({
      success: true,
      message: 'Machinery defects retrieved successfully',
      defects,
    });
  } catch (error) {
    console.error('Error fetching machinery defects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve machinery defects',
      error: error.message,
    });
  }
});


router.post('/queue-fulfillment', authMiddleware('supervisor'), async (req, res) => {
  const { supervisorName, contactNumber, wealthCenterName, category, cubeNumber, photo } = req.body;

  let uploadedCubeImageUrl = null;

  try {
    if (photo) {
      const base64Data = photo.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const fileName = `${uuidv4()}.jpg`;

      const uploadPath = path.join('/home/complaint-system/uploads', fileName);

      const dirPath = path.dirname(uploadPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFileSync(uploadPath, buffer);

      uploadedCubeImageUrl = `https://sas.briskode.online/uploads/${fileName}`;
    }
    else if (req.file) {
      uploadedCubeImageUrl = `https://sas.briskode.online/uploads/${req.file.filename}`;
    }

    if (!uploadedCubeImageUrl) {
      return res.status(200).json({
        success: false,
        message: 'Photo is required.',
      });
    }

    // Creating the QueueFulfillment record in the database
    const queueFulfillment = await QueueFulfillment.create({
      supervisorId: req.user.id,
      supervisorName,
      contactNumber,
      wealthCenterName,
      category,
      cubeNumber,
      photo: uploadedCubeImageUrl,  // Saving the uploaded image URL
    });

    res.status(201).json({
      success: true,
      message: 'Queue fulfillment record created successfully',
      queueFulfillment,
    });
  } catch (error) {
    console.error('Error creating queue fulfillment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create queue fulfillment record',
      error: error.message,
    });
  }
});


// GET Queue Fulfillments
router.get('/queue-fulfillments', authMiddleware('supervisor'), async (req, res) => {
  try {
    const fulfillments = await QueueFulfillment.findAll({ where: { supervisorId: req.user.id } });
    res.status(200).json({
      success: true,
      message: 'Queue fulfillments retrieved successfully',
      fulfillments,
    });
  } catch (error) {
    console.error('Error fetching queue fulfillments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve queue fulfillments',
      error: error.message,
    });
  }
});

// Mo Khata Entry Route
router.post('/mo-khata', authMiddleware('supervisor'), async (req, res) => {
  const { supervisorName, contactNumber, moKhataGeneration, moKhataStock, sold } = req.body;

  try {
    const moKhata = await MoKhata.create({
      supervisorId: req.user.id, // Assuming the supervisor's ID is available from the authentication
      supervisorName,
      contactNumber,
      moKhataGeneration,
      moKhataStock,
      sold,
    });

    res.status(201).json({
      message: 'Mo Khata Entry Created Successfully',
      moKhata,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating Mo Khata entry', error: error.message });
  }
});


// GET Mo Khatas
router.get('/mo-khatas', authMiddleware('supervisor'), async (req, res) => {
  try {
    const moKhatas = await MoKhata.findAll({ where: { supervisorId: req.user.id } });
    res.status(200).json({
      success: true,
      message: 'Mo Khata entries retrieved successfully',
      moKhatas,
    });
  } catch (error) {
    console.error('Error fetching Mo Khata entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Mo Khata entries',
      error: error.message,
    });
  }
});


// Update MoKhata Entry
router.put('/mo-khatas-update/:id', authMiddleware('supervisor'), async (req, res) => {
  try {
    const { status, supervisorName, contactNumber, moKhataGeneration, moKhataStock, sold } = req.body;
    
    // Find and update the MoKhata
    const moKhata = await MoKhata.update(
      { status, supervisorName, contactNumber, moKhataGeneration, moKhataStock, sold },
      { where: { id: req.params.id }, returning: true }
    );

    if (moKhata[0] === 0) {
      return res.status(200).json({
        success: false,
        message: 'MoKhata not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'MoKhata entry updated successfully',
      MoKhata: moKhata[1][0],
    });
  } catch (error) {
    console.error('Error updating MoKhata entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update MoKhata entry',
      error: error.message,
    });
  }
});



module.exports = router;
