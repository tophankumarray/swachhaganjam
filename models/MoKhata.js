// models/MoKhata.js
module.exports = (sequelize, Sequelize) => {
  const MoKhata = sequelize.define('MoKhata', {
    supervisorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Assuming you have a Users table
        key: 'id',
      },
    },
    supervisorName: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    contactNumber: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    moKhataGeneration: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    moKhataStock: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    sold: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    dateTime: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  return MoKhata;
};
