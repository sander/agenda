const cheerio = require("cheerio");
const request = require("request-promise-native");

module.exports.fetch = async url => cheerio.load(await request(url));

module.exports.optionalDate = (key, val) => val && { [key]: new Date(val) };
