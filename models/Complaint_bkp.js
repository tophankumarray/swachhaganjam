module.exports = (sequelize, Sequelize) => {
  const Complaint = sequelize.define('Complaint', {
    citizenId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    citizenName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    wardNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    area: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    dateTime: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    photo: {
      type: Sequelize.TEXT('long'),
    },
    category: {
      type: Sequelize.ENUM(
        'Illegal Dumping of C & D Waste',
        'Dead Animals',
        'Practice of Manual Scavenging',
        'Open Defecation',
        'Urination in Public',
        'No Electricity in Public Toilet',
        'Stagnant Water on the Road',
        'Sewerage or Storm Water Overflow',
        'Open Manholes or Drains',
        'Improper Disposal of Faecal Waste or Septage',
        'Cleaning of Sewer',
        'Public Toilet Blockage',
        'Public Toilet Cleaning',
        'Cleaning of Drain',
        'No Water Supply in Public Toilet',
        'Garbage Dump',
        'Dustbins Not Cleaned',
        'Sweeping Not Done',
        'Burning Of Garbage In Open Space',
        'Garbage Vehicle Not Arrived',
        'Cleaning of Garbage from Public Spaces',
        'Cleaning of Street Roads',
        'Door To Door Collection Not Done'
      ),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('Started', 'In Progress', 'Done'),
      defaultValue: 'Started',
    },
    // New field for Active/Inactive status
    activeStatus: {
      type: Sequelize.ENUM('Active', 'Inactive'),
      defaultValue: 'Active', // Default to Active
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  return Complaint;
};
