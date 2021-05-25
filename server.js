const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
require('dotenv').config();

const errorHandler = require('./handlers/error');
const getCoins = require('./handlers/coins');
const getCoinLatest = require('./handlers/coin-latest');
const getNews = require('./handlers/news');
const { deleteUserCoin, saveUserCoin, getUserCoins } = require('./handlers/user');
// const getCoinInfo = require('./handlers/coin-info');

// Global Variables
const PORT = process.env.PORT || 3001;
const MONGO_DB_URL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/crypto-tracks';

mongoose.connect(`${MONGO_DB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());

// Cors Fix
app.use(cors());

// Error Handling
app.use(errorHandler)

// Server Routes
app.get('/', (req, res) => {
  res.send('Make Crypto Great!');
});

// Get Available Coins
app.get('/coins', getCoins);

// Get Coin Info - REMOVED DUE TO API LIMITS
// app.get('/coin-info', getCoinInfo);

// Get Specific Coin Price
app.get('/coin-latest', getCoinLatest);

// Get News
app.get('/news', getNews);

// Get User Coins
app.get('/tracked/read/:email', getUserCoins);

// Add Coin & User
app.post('/tracked/update', saveUserCoin);

// Delete Coin from User
app.delete('/tracked/delete', deleteUserCoin);

// Listen on Port
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
