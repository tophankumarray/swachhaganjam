const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const User = db.User;

router.post('/login', async (req, res) => {
  try {
    let { username, password, phoneNumber, otp, role } = req.body;
    username = username ? username.trim() : null;
    password = password ? password.trim() : null;
    phoneNumber = phoneNumber ? phoneNumber.trim() : null;
    otp = otp ? otp.trim() : null;
    role = role ? role.trim() : null;

    try {
      if (role === 'admin') {
        const supervisor = await User.findOne({
          where: { username, role: 'admin' }
        });
        if (!supervisor) {
          return res.status(200).json({ success: false, message: 'Username not found for admin' });
        }
    
        // Compare password
        const isMatch = await bcrypt.compare(password, supervisor.password);
        if (!isMatch) {
          return res.status(200).json({ success: false, message: 'Incorrect password for admin' });
        }
    
        // Check account validity (1-year validity)
        const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
        if (Date.now() - new Date(supervisor.createdAt).getTime() > oneYearInMs) {
          return res.status(200).json({ success: false, message: 'Admin account expired' });
        }
    
        // Update supervisor details
        supervisor.updatedAt = new Date();
        supervisor.changed('updatedAt', true);
        await supervisor.save();
    
        const role = username === 'admin' ? 'admin' : 'supervisor';
        const token = jwt.sign({ id: supervisor.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        return res.status(200).json({ success: true, message: 'Admin login successful', token, supervisor });
      }
    
      if (role === 'supervisor') {
        const supervisor = await User.findOne({
          where: { username, role: 'supervisor' }
        });
    
        if (!supervisor) {
          return res.status(200).json({ success: false, message: 'Username not found for supervisor' });
        }
    
        // Compare password
        const isMatch = await bcrypt.compare(password, supervisor.password);
        if (!isMatch) {
          return res.status(200).json({ success: false, message: 'Incorrect password for supervisor' });
        }
    
        // Check account validity (1-year validity)
        const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
        if (Date.now() - new Date(supervisor.createdAt).getTime() > oneYearInMs) {
          return res.status(200).json({ success: false, message: 'Supervisor account expired' });
        }
    
        // Update supervisor details
        supervisor.updatedAt = new Date();
        supervisor.changed('updatedAt', true);
        await supervisor.save();
    
        const role = username === 'admin' ? 'admin' : 'supervisor';
        const token = jwt.sign({ id: supervisor.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        return res.status(200).json({ success: true, message: 'Supervisor login successful', token, supervisor });
      }
    
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
        error: error.message
      });
    }
    

    // If role is citizen
    if (role === 'citizen') {
      // Citizen Login Logic
      if (otp !== '1111') {
        return res.status(200).json({ success: false, message: 'Invalid OTP' });
      }

      let citizen = await User.findOne({ where: { phoneNumber } });

      
      if (!citizen) {
        citizen = await User.create({ 
          phoneNumber, 
          name: `Citizen_${phoneNumber}`, 
          role: 'citizen'
        });
      } else {
        citizen.updatedAt = new Date();
        citizen.changed('updatedAt', true);
        await citizen.save();
      }
      
      const token = jwt.sign({ id: citizen.id, role: 'citizen' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      return res.status(200).json({ success: true, message: 'Login successful', token, citizen });
    }

    return res.status(200).json({ success: false, message: 'Invalid role' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});


// Admin: Create Supervisor
router.post('/supervisor', authMiddleware('admin'), async (req, res) => {
  try {
    const { username, password, name, contactNumber } = req.body;

    // ✅ Check if username already exists
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(200).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new supervisor
    const supervisor = await User.create({
      username,
      password: hashedPassword,
      name,
      contactNumber,
      role: 'supervisor',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Supervisor created successfully',
      supervisor,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create supervisor',
      error: error.message,
    });
  }
});


module.exports = router;
