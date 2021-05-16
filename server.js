const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose'); TODO Add dependency when we start using mongoose
require('dotenv').config();

const errorHandler = require('./handlers/error');
const getCoins = require('./handlers/coins');
const getCoinInfo = require('./handlers/coin-info');
const getCoinLatest = require('./handlers/coin-latest');
const getNews = require('./handlers/news');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

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

// Get Coin Info
app.get('/coin-info', getCoinInfo);

// Get Specific Coin Price
app.get('/coin-latest', getCoinLatest);

// Get News
app.get('/news', getNews);

// Listen on Port
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));