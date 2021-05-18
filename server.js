const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
require('dotenv').config();

const errorHandler = require('./handlers/error');
const getCoins = require('./handlers/coins');
const getCoinInfo = require('./handlers/coin-info');
const getCoinLatest = require('./handlers/coin-latest');
const getNews = require('./handlers/news');

mongoose.connect(`${MONGODB_URI}`, { useNewUrlParser: true, useUnifiedTopology: true });

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

app.post('/user-coins', (req, res) => {
  User.find({ email: req.body.email }, (err, databaseResults) => {
    if (databaseResults.length < 1) {
      res.status(400).send('error: user does not exist');
    } else {
      let user = databaseResults[0];
      req.body.userCoins.forEach(item => {
        //below if/else is from best books, rewrite for crypto tracker? Or not necessary?
        if (typeof (item.name) === 'string' && typeof (item.description) === 'string' && typeof (item.status) === 'boolean') {
          user.userCoins.push(item);
        } else {
          console.log('invalid entry');
        }
      });
      user.save().then((databaseResults) => {
        res.send(databaseResults.userCoins);
      });
    }
  });
});

// Listen on Port
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));