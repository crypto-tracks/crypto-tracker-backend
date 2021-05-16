'use strict';

const superagent = require('superagent');

let cache = require('./cache');
const cmcHeaders = require('../constants/cmc-headers');

const getCoins = async(req, res, next) => {
  try{
    const key = 'available-coins';
    const url = `${process.env.COIN_MARKET_CAP_API_URL}/cryptocurrency/map`;
    // Cache results for 1 day
    if (cache[key] && (Date.now() - cache[key].timestamp < 86400000)) { 
      console.log('Cache hit');
    } else {
      console.log('Cache miss');
      cache[key] = {};
      cache[key].timestamp = Date.now();
      let response = await superagent
        .get(url)
        .set(cmcHeaders);
      let parsed = await parseCoins(response);
      cache[key].data = parsed;
    }
    res.json(cache[key].data);
  } catch(err) {
    next(err);
  }
}

function parseCoins(coinData) {
  try {
    const availableCoins = coinData.body.data.map(coin => {
      return new Coin(coin);
    });
    return Promise.resolve(availableCoins);
  } catch (e) {
    return Promise.reject(e);
  }
}


function Coin(info) {
  this.id = info.id;
  this.name = info.name;
  this.symbol = info.symbol;
  this.rank = info.rank;
  this.isActive = info.is_active;
  this.searchTerms = [info.name, info.symbol]
};

module.exports = getCoins;