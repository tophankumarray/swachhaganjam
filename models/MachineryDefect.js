module.exports = (sequelize, Sequelize) => {
	  const MachineryDefect = sequelize.define('MachineryDefect', {
		      supervisorId: {
			            type: Sequelize.INTEGER,
			            allowNull: false,
			            references: {
					            model: 'Users',
					            key: 'id',
					          },
			          },
		      supervisorName: {
			            type: Sequelize.STRING,
			            allowNull: false,
			          },
		      contactNumber: {
			            type: Sequelize.STRING,
			            allowNull: false,
			          },
		      machineName: {
			            type: Sequelize.ENUM(
					            'Sheaving/Screening Machine',
					            'Balling Machine',
					            'Incinerator',
					            'Grass Cutter',
					            'Tree Cutter',
					            'Grease Gun',
					            'Shredder Machine'
					          ),
			            allowNull: false,
			          },
		      photo: {
			            type: Sequelize.STRING,
			          },
		      description: {
			            type: Sequelize.TEXT,
			            allowNull: false,
			          },
		      dateTime: {
			            type: Sequelize.DATE,
			            defaultValue: Sequelize.NOW,
			          },
		      status: {
			            type: Sequelize.ENUM('Started', 'In Progress', 'Done'),
			            defaultValue: 'Started',
			          },
		      is_seen: {
			            type: Sequelize.BOOLEAN,
			            defaultValue: false, // Default to false
			            allowNull: false,
			          },
		    });

	  return MachineryDefect;
};

