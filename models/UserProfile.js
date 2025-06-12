const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  phone: {type: Number},
  Address: {type: String}
});

module.exports = mongoose.model('UserProfile', profileSchema);