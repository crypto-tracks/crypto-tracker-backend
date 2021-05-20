'use strict';

const UserModel = require('../models/User');

const getUserCoins = async(req, res, next) => {
  try {
    const user = await UserModel.find({ email: req.body.email });
    if (!user.length) {
      // console.log('User Not Found');
      const newUser = await new UserModel({
        email: req.body.email,
        coins: []
      }).save();
      res.json(newUser);
    } else {
      res.json(user[0]);
    }
  } catch (err) {
    next(err);
  }
}

const saveUserCoin = async(req, res, next) => {
  try {
    const user = await UserModel.find({ email: req.body.email });
    // New User Adding Coin - Add User and Coin
    if (!user.length) {
      // console.log('User Not Found');
      const newUser = new UserModel({
        email: req.body.email,
        coins: req.body.symbol
      });
      res.json(await newUser.save());
    // Existing User Adding Coin - Add Coin to User
    } else {
      // console.log('User Found: ', user);
      // Don't add coins already present
      if (!user[0].coins.includes(req.body.symbol)) {
        user[0].coins.push(req.body.symbol);
      }
      res.json(await user[0].save());
    }
  } catch(err) {
    next(err)
  }
};

const deleteUserCoin = async(req, res, next) => {
  // console.log('delete called');
  try {
    const user = await UserModel.find({ email: req.body.email });
    // console.log('Coins Prior to Delete: ', user[0].coins);
    user[0].coins = user[0].coins.length ? user[0].coins.filter(coin => coin !== req.body.symbol) : [];
    // console.log('Coins After Delete: ', user[0].coins);
    res.json(await user[0].save());
  } catch (err) {
    next(err);
  }
}

module.exports = { saveUserCoin, getUserCoins, deleteUserCoin };
