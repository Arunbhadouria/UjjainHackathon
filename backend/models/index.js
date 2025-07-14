const User = require('./User');
const Zone = require('./Zone');
const RFIDTag = require('./RFIDTag');

// Define associations
User.hasMany(RFIDTag, { foreignKey: 'userId' });
RFIDTag.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Zone,
  RFIDTag
};