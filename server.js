const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
require('dotenv').config();

const errorHandler = require('./handlers/error');
const getCoins = require('./handlers/coins');
const getCoinInfo = require('./handlers/coin-info');
const getCoinLatest = require('./handlers/coin-latest');
const getNews = require('./handlers/news');

mongoose.connect('mongodb://localhost:27017/crypto-tracks', { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('./models/User');

const tylerUser = new User({
  userEmail: 'tyler@csdconsultants.us',
  userName: 'tyler',
  userCoin: []
})

tylerUser.save(function (err) {
    if (err) console.log(err);
    else console.log('saved the user');
  });

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

//
app.post('/user-coins', (req, res) => {
  User.find({ email: req.body.email }, (err, databaseResults) => {
    if (databaseResults.length < 1) {
      res.status(400).send('error: user does not exist');
    } else {
      let user = databaseResults[0];
      req.body.userCoins.forEach(item => {
        user.userCoins.push(item);
      });
      user.save().then((databaseResults) => {
        res.send(databaseResults.userCoins);
      });
    }
  });
});

app.put('/user-coins/:id', (req, res) => {
  User.find({ email: req.body.email }, (err, databaseResults) => {
    let user = databaseResults[0];
    let coinId = req.params.id;
    user.userCoins.forEach((coin, index) => {
      if (coin._id.toString() === coinId) {
        coin.symbol = req.body.coin[0].symbol;
        coin.trackedAttributes = req.body.coin[0].trackedAttributes;
      }
    });
    user.save().then(userData => {
      console.log(userData);
      res.send(userData.books);
    });
  });
});

app.delete('/user-coins/:id', (req, res) => {
  console.log('delete called');
  let email = req.query.email;
  User.find({ email: email }, (err, userData) => {
    let user = userData[0];
    user.userCoins = user.userCoins.filter(coin => coin._id.toString() !== req.params.id);
    user.save().then(userData => {
      res.send(userData.userCoins)
    });
  });
});

// Listen on Port
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));