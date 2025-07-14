const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Zone = sequelize.define('Zone', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currentPopulation: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  colorCode: {
    type: DataTypes.STRING,
    defaultValue: '#44ff44'
  },
  boundary: {
    type: DataTypes.GEOMETRY('POLYGON'),
    allowNull: true
  }
});

module.exports = Zone;