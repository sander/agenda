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

const request = require("request-promise-native");

const BASE = "https://dezwijger.nl/ajax/agenda/getItems?index=";

module.exports.indexEvents = async () => {
  const events = [];

  for (let i = 0; ; i += 20) {
    const { buckets } = JSON.parse(await request(`${BASE}${i}`));

    if (Object.keys(buckets).length === 0) break;

    for (const bucketKey in buckets) {
      for (const {
        title,
        link,
        meta: { event_suptitel, event_subtitle, location, date, end_date, time }
      } of buckets[bucketKey])
        events.push(
          Object.assign(
            {
              title,
              url: link,
              suptitle: event_suptitel,
              description: event_subtitle,
              location: `${location.name}${
                location.description
                  ? ", " + location.description.replace("\r\n", ", ")
                  : ""
              }`
            },
            end_date
              ? {
                  start: new Date(date),
                  end: new Date(end_date)
                }
              : { date: new Date(`${date} ${time}`) }
          )
        );
    }
  }

  return events;
};
