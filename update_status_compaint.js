const express = require('express');
const dotenv = require('dotenv');
const db = require('./models'); // ✅ fixed path
const { Sequelize } = require('sequelize');
const Complaint = db.Complaint;

dotenv.config();

async function updateComplaintStatuses() {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const complaintsToUpdate = await Complaint.findAll({
      where: {
        activeStatus: 'Active',
        createdAt: {
          [Sequelize.Op.lt]: oneMonthAgo,
        },
      },
    });

    if (complaintsToUpdate.length > 0) {
      const [updatedCount] = await Complaint.update(
        { activeStatus: 'Inactive' },
        {
          where: {
            id: complaintsToUpdate.map(complaint => complaint.id),
          },
        }
      );

      console.log(`${updatedCount} complaints updated to Inactive.`);
    } else {
      console.log('No complaints older than one month to update.');
    }
  } catch (error) {
    console.error('Error while updating complaints:', error);
  }
}

updateComplaintStatuses();
