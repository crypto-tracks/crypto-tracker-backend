'use strict';

const superagent = require('superagent');

let cache = require('./cache');
const cmcHeaders = require('../constants/cmc-headers');

const getCoinInfo = async (req, res, next) => {
  try {
    const key = `coin-info-${req.query.symbol}`;
    const url = `${process.env.COIN_MARKET_CAP_API_URL}/cryptocurrency/info?symbol=${req.query.symbol}`;
    // Cache results for 1 week
    // tiny preference: I'd rather have 1000 * 60 * 60 * 24 * 7 than this number, as it shows a bit more of where it comes from.
    if (cache[key] && Date.now() - cache[key].timestamp < 604800000) {
      console.log('Cache hit');
    } else {
      console.log('Cache miss');
      cache[key] = {};
      cache[key].timestamp = Date.now();
      let response = await superagent
        .get(url)
        .set(cmcHeaders);
      let parsed = await parseInfo(response.body.data[`${req.query.symbol}`]);
      cache[key].data = parsed;
    }
    res.json(cache[key].data);
  } catch (err) {
    next(err);
  }
};

function parseInfo(info) {
  try {
    const availableCoinInfo = new CoinInfo(info);
    return Promise.resolve(availableCoinInfo);
  } catch (e) {
    return Promise.reject(e);
  }
}

function CoinInfo(info) {
  this.id = info.id;
  this.name = info.name;
  this.symbol = info.symbol;
  this.category = info.category;
  this.description = info.description;
  this.logo = info.logo;
  this.dateAddedToCoinMarketCap = info.date_added;
  // External Urls
  this.website = info.urls.website;
  this.explorers = info.urls.explorer;
  this.reddit = info.urls.reddit;
  this.technicalDocs = info.urls.technical_doc;
  this.sourceCode = info.urls.source_code;
  this.announcement = info.urls.announcement;
}

module.exports = getCoinInfo;
