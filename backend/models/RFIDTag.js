const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RFIDTag = sequelize.define('RFIDTag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tagId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  tagType: {
    type: DataTypes.ENUM('civilian', 'vip', 'sadhu', 'companion'),
    defaultValue: 'civilian'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = RFIDTag;