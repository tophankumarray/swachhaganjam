const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    timezone: '+05:30',
    logging: false,
  }
);


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models

db.User = require('./User')(sequelize, Sequelize);
db.Complaint = require('./Complaint')(sequelize, Sequelize);
db.MachineryDefect = require('./MachineryDefect')(sequelize, Sequelize);
db.QueueFulfillment = require('./QueueFulfillment')(sequelize, Sequelize);
db.MoKhata = require('./MoKhata')(sequelize, Sequelize);

// Define associations
db.Complaint.belongsTo(db.User, { foreignKey: 'citizenId' });
db.MachineryDefect.belongsTo(db.User, { foreignKey: 'supervisorId' });
db.QueueFulfillment.belongsTo(db.User, { foreignKey: 'supervisorId' });
db.MoKhata.belongsTo(db.User, { foreignKey: 'supervisorId' });

module.exports = db;