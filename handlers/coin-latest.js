'use strict';

const superagent = require('superagent');

let cache = require('./cache');
const cmcHeaders = require('../constants/cmc-headers');

const getCoinLatest = async(req, res, next) => {
  try {
    const key = 'coin-price-latest';
    const url = `${process.env.COIN_MARKET_CAP_API_URL}/cryptocurrency/listings/latest?limit=5000`
    // console.log(url);
    // Cache results for 5 minutes
    if (cache[key] && (Date.now() - cache[key].timestamp < 300000)) { 
      console.log('Cache hit');
    } else {
      console.log('Cache miss');
      cache[key] = {};
      cache[key].timestamp = Date.now();
      let response = await superagent
        .get(url)
        .set(cmcHeaders);
      let parsed = await parseLatest(response.body.data);
      cache[key].data = parsed;
    }
    res.json(await coinFinder(cache[key].data, req.query.symbol));
  } catch (err) {
    next(err);
  }
}

// Helper Method to find specific coins
function coinFinder(coins, symbol) {
  try {
    // console.log('coinFinder', coins)
    const coinReturn = coins.filter(item => item.symbol === symbol);
    // console.log(coinReturn);
    return Promise.resolve(coinReturn);
  } catch(e) {
    return Promise.reject(e);
  }
}

// Parse all coins to 
function parseLatest(coins) {
  try {
    // console.log('parseLatest', coins)
    const coinPriceLatest = coins.map(coin => {
      return new CoinLatest(coin);
    });
    return Promise.resolve(coinPriceLatest);
  } catch (e) {
    return Promise.reject(e);
  }
}

function CoinLatest(coin) {
  this.id = coin.id;
  this.name = coin.name;
  this.symbol = coin.symbol;
  this.dateAdded = coin.date_added;
  this.circulatingSupply = coin.circulating_supply;
  this.totalSupply = coin.total_supply;
  this.cmcRank = coin.cmc_rank;
  this.lastUpdated = coin.last_updated;
  this.quoteUsd = {
    price: coin.quote.USD.price,
    volume24h: coin.quote.USD.volume_24h,
    percentChange1h: coin.quote.USD.percent_change_1h,
    percentChange24h: coin.quote.USD.percent_change_24h,
    percentChange7d: coin.quote.USD.percent_change_7d,
    percentChange30d: coin.quote.USD.percent_change_30d,
    percentChange60d: coin.quote.USD.percent_change_60d,
    percentChange90d: coin.quote.USD.percent_change_90d,
    marketCap: coin.quote.USD.market_cap,
    lastUpdated: coin.quote.USD.last_updated,
  }
}

module.exports = getCoinLatest;
