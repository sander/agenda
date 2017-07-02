const cheerio = require("cheerio");
const request = require("request-promise-native");

const { meetupGroups } = require("../config");

const BASE = "https://api.meetup.com/2/events?group_id=";

const dates = ({ time, duration }) =>
  duration
    ? { start: new Date(time), end: new Date(time + duration) }
    : { date: new Date(time) };

const location = ({ name, address_1, city }) => ({
  location: `${name}, ${address_1} ${city}`
});

module.exports.indexEvents = async () =>
  JSON.parse(
    await request(`${BASE}${Object.keys(meetupGroups).join(",")}`)
  ).results.map(
    ({ name, event_url, description, time, duration, group, venue }) => ({
      suptitle: group.name,
      title: name,
      url: event_url,
      description: cheerio
        .load(description.replace("<br/>", " "))("p:first-child")
        .text()
        .replace(/([\.\?!]) .+/, (match, p) => p),
      ...(venue ? location(venue) : {}),
      ...dates({ time, duration })
    })
  );
