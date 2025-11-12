const express = require('express');
const router = express.Router();
const db = require('../models');
const Complaint = db.Complaint;
const MachineryDefect = db.MachineryDefect;
const QueueFulfillment = db.QueueFulfillment;
const MoKhata = db.MoKhata;
const User = db.User;
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this is present


router.get('/users', authMiddleware('admin'), async (req, res) => {
  try {
    const users = await User.findAll(); // <-- Don't redeclare 'User'
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message,
    });
  }
});

// View All Complaints
router.get('/complaints', authMiddleware('admin'), async (req, res) => {
  try {
    const complaints = await Complaint.findAll();
    res.status(200).json({
      success: true,
      message: 'Complaints retrieved successfully',
      complaints,
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaints',
      error: error.message,
    });
  }
});

// Update Complaint Status
router.put('/complaint/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.update(
      { status },
      { where: { id: req.params.id }, returning: true }
    );
    if (complaint[0] === 0) {
      return res.status(200).json({
        success: false,
        message: 'Complaint not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint: complaint[1][0],
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint status',
      error: error.message,
    });
  }
});

// View All Machinery Defects
router.get('/machinery-defects', authMiddleware('admin'), async (req, res) => {
  try {
    const defects = await MachineryDefect.findAll();
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

// Update Machinery Defect Status
router.put('/machinery-defect/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const defect = await MachineryDefect.update(
      { status },
      { where: { id: req.params.id }, returning: true }
    );
    if (defect[0] === 0) {
      return res.status(200).json({
        success: false,
        message: 'Machinery defect not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Machinery defect status updated successfully',
      defect: defect[1][0],
    });
  } catch (error) {
    console.error('Error updating machinery defect status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update machinery defect status',
      error: error.message,
    });
  }
});

// View All Queue Fulfillments
router.get('/queue-fulfillments', authMiddleware('admin'), async (req, res) => {
  try {
    const fulfillments = await QueueFulfillment.findAll();
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


router.put('/queue-fulfillments/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { status } = req.body;

    const updatedFulfillment = await QueueFulfillment.update(
      { status },
      { where: { id: req.params.id }, returning: true }
    );

    if (updatedFulfillment[0] === 0) {
      return res.status(200).json({
        success: false,
        message: 'Queue Fulfillment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Queue Fulfillment updated successfully',
      fulfillment: updatedFulfillment[1][0],
    });
  } catch (error) {
    console.error('Error updating queue fulfillment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update queue fulfillment',
      error: error.message,
    });
  }
});


// View All Mo Khata Entries
router.get('/mo-khatas', authMiddleware('admin'), async (req, res) => {
  try {
    const moKhatas = await MoKhata.findAll();
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


router.put('/mo-khatas/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { sold } = req.body;

    const updatedMoKhata = await MoKhata.update(
      { sold },
      { where: { id: req.params.id }, returning: true }
    );

    console.log(updatedMoKhata)

    if (updatedMoKhata[0] === 0) {
      return res.status(200).json({
        success: false,
        message: 'MoKhata not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'MoKhata updated successfully',
      moKhata: updatedMoKhata[1][0],
    });
  } catch (error) {
    console.error('Error updating MoKhata:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update MoKhata',
      error: error.message,
    });
  }
});



// Notification API for Latest Complaint and Machinery Defect
router.get('/notifications', authMiddleware('admin'), async (req, res) => {
  try {
    // Define whereClause for filtering by 'is_seen = false'
    const whereClause = { is_seen: false };

    // Fetch all complaints with 'is_seen = false'
    const latestComplaint = await Complaint.findAll({
      where: whereClause, // Apply the filter for 'is_seen = false'
      order: [['createdAt', 'DESC']],
    });

    // Fetch all machinery defects with 'is_seen = false'
    const latestDefect = await MachineryDefect.findAll({
      where: whereClause, // Apply the filter for 'is_seen = false'
      order: [['createdAt', 'DESC']],
    });

    // If no complaints or defects were found
    if (latestComplaint.length === 0 && latestDefect.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No complaints or machinery defects not found',
      });
    }

    // Prepare the response array for notifications
    const notifications = [];

    // Add the complaints to the notifications array
    if (latestComplaint.length > 0) {
      latestComplaint.forEach(complaint => {
        notifications.push({
          type: 'Complaint',
          id: complaint.id,
          message: `New complaint received: ${complaint.description}. Reported by: ${complaint.citizenName}`,
          createdAt: complaint.createdAt,
        });
      });
    }

    // Add the machinery defects to the notifications array
    if (latestDefect.length > 0) {
      latestDefect.forEach(defect => {
        notifications.push({
          type: 'Machinery Defect',
          reported: defect.supervisorName,
          id: defect.id,
          message: `New machinery defect reported`,
          createdAt: defect.createdAt,
        });
      });
    }

    // Return the notifications
    res.status(200).json({
      success: true,
      message: 'Latest notifications fetched successfully',
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: error.message,
    });
  }
});


// PUT API to update 'is_seen' to true based on query parameter
router.put('/notifications', authMiddleware('admin'), async (req, res) => {
  try {
    // Get the 'is_seen' query parameter
    const { is_seen } = req.query;

    // Check if 'is_seen' query parameter is provided and it is 'true'
    if (is_seen !== 'true') {
      return res.status(400).json({
        success: false,
        message: "'is_seen' query parameter must be 'true'",
      });
    }

    // Find all complaints where 'is_seen' is false
    const complaintsToUpdate = await Complaint.findAll({
      where: { is_seen: false },
    });

    // Find all machinery defects where 'is_seen' is false
    const defectsToUpdate = await MachineryDefect.findAll({
      where: { is_seen: false },
    });

    // If no records are found
    if (complaintsToUpdate.length === 0 && defectsToUpdate.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No complaints or machinery defects not found',
      });
    }

    // Prepare an array to hold updated notifications
    const updatedNotifications = [];

    // Update 'is_seen' to true for all complaints
    for (const complaint of complaintsToUpdate) {
      complaint.is_seen = true;
      await complaint.save();
      updatedNotifications.push({
        type: 'Complaint',
        id: complaint.id,
        is_seen: complaint.is_seen,
      });
    }

    // Update 'is_seen' to true for all machinery defects
    for (const defect of defectsToUpdate) {
      defect.is_seen = true;
      await defect.save();
      updatedNotifications.push({
        type: 'Machinery Defect',
        id: defect.id,
        is_seen: defect.is_seen,
      });
    }

    // Return success response with updated notifications
    res.status(200).json({
      success: true,
      message: 'All notifications with is_seen=false have been updated to true',
      updatedNotifications,
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications',
      error: error.message,
    });
  }
});


module.exports = router;
