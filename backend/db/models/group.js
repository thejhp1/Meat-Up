'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      })

      Group.hasMany(models.Venue, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      })

      Group.hasMany(models.Membership, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      })

      Group.belongsTo(models.User, {
        foreignKey: 'organizerId'
      })

      Group.hasMany(models.Event, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      })
    }
  }
  Group.init({
    organizerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    about: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM("In person","Online"),
    },
    private: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [2,2],
        isAlpha: true,
        isUppercase: true
      }
    },
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
