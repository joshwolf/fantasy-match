var _ = require('lodash');

module.exports = function(sequelize, DataTypes) {
  var League = sequelize.define("League", {
  	name: DataTypes.STRING,
  	team_count: DataTypes.INTEGER,
  	player_pool: DataTypes.ENUM('Mixed','AL-Only','NL-Only'),
  	host: DataTypes.STRING,
  	url: DataTypes.STRING,
  	fee: DataTypes.INTEGER,
  	payout_teams: DataTypes.INTEGER,
  	offensive_categories: DataTypes.STRING,
  	defensive_categories: DataTypes.STRING,
  	uses_faab: DataTypes.BOOLEAN,
  	keeper_details: DataTypes.STRING,
  	roster_details: DataTypes.STRING,
  	notes: DataTypes.STRING,
  	start_year: DataTypes.DATE,
	play_date: DataTypes.DATE
	}, {
	  indexes: [
		{
		  fields: ['player_pool','host']
		}
	  ],
	  classMethods: {
		associate: function(models) {
			League.belongsTo(models.User, {as: 'Creator'});
			League.belongsTo(models.User, {as: 'Inquirer'});
		}
	  },
		instanceMethods: {
			getFacebookPostTitle: function() {
			}
		}
	});
  return League;
};