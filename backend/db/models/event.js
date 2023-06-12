'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
        hooks: true
      })

      Event.belongsToMany(models.User, {
        through: models.Attendance,
        foreignKey: 'eventId',
        otherKey: 'userId'
      })

      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      })

      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  Event.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    venueId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    groupId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('Online', 'In person'),
    },
    capacity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
