'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {type: 'String', required:true},
  coins: {type: ['String']}
});

module.exports = mongoose.model('user', userSchema);