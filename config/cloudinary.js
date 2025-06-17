const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'djrnozthb',
  api_key: '259864563938676',
  api_secret: 'lcnBniDaWWqckG1Hv74ykFcvRiI',
});

module.exports = cloudinary;