// @ts-check

/*
 * sander/agenda - crawls and displays interesting design-related events
 * Copyright © 2017 Sander Dijkhuis <mail@sanderdijkhuis.nl>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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
