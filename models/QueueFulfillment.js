module.exports = (sequelize, Sequelize) => {
  const QueueFulfillment = sequelize.define('QueueFulfillment', {
    supervisorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    supervisorName: {
      type: Sequelize.STRING(100), // Limiting length to 100
      allowNull: false,
    },
    contactNumber: {
      type: Sequelize.STRING(20), // You can set the length as per your requirement
      allowNull: false,
    },
    wealthCenterName: {
      type: Sequelize.STRING(255),
      defaultValue: 'Gopalpur NAC',
    },
    dateTime: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    category: {
      type: Sequelize.ENUM('MCC', 'MRF'),
      allowNull: false,
      defaultValue: 'MCC', // Added default value if needed
    },
    cubeNumber: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    photo: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('Started', 'In Progress', 'Done'),
      defaultValue: 'Started',
    },
  });

  return QueueFulfillment;
};
