'use strict';

const Feed = require('rss-to-json');

let cache = require('./cache');

const getNews = async(req, res, next) => {
  try {
    const key = 'news-latest-' + req.query.q
    const url = `https://news.google.com/news?q=${req.query.q}&output=rss`
    // console.log(url);
    // Cache results for 15 minutes
    if (cache[key] && (Date.now() - cache[key].timestamp < 900000)) { 
      console.log('Cache hit');
    } else {
      console.log('Cache miss');
      cache[key] = {};
      cache[key].timestamp = Date.now();
      var rss = await Feed.load(url);
      let parsed = await parseNews(rss.items);
      cache[key].data = parsed;
    }
    res.json(cache[key].data);
  } catch (err) {
    next(err);
  }
}

// // Helper Function to get second group
// // https://stackoverflow.com/a/432503/7967484
// function getGroup(regexp, str, group) {
//   return Array.from(str.matchAll(regexp), m => m[group]);
// }

function parseNews(news) {
  try {
    // console.log(jsonNews);
    const latestNews = news.map(story => {
      return new News(story);
    });
    return Promise.resolve(latestNews.sort((a, b) => b.published_unix - a.published_unix));
  } catch (e) {
    return Promise.reject(e);
  }
}

function News(story) {
  this.id = story.id;
  this.title = story.title;
  // this.description = getGroup(/<a[^>]*>(.*?)<\/a>/g, story.description, 1);
  this.url = story.url;
  this.link = story.link;
  this.published_unix = story.published;
  this.published = new Date(story.published).toISOString();
  this.created = new Date(story.created).toISOString();
};

module.exports = getNews;