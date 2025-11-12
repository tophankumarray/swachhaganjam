module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
      username: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contactNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM('citizen', 'supervisor', 'admin'),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    }, {
      tableName: 'Users',
      timestamps: true, // Make sure timestamps are enabled (this is default)
    });

    return User;
  };

