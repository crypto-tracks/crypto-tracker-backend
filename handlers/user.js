'use strict';

const { request } = require('express');
const UserModel = require('../models/User');

const User = { };

User.getOneUser = async(req,res,next) => {
  try {
    const email = req.query.email;
    const user = await UserModel.find({email:req.query.email}, (err, databaseResults) => {
      res.send (databaseResults)
    })
  } catch(err) { 
    next(err);
  }
}

