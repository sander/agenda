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

const { fetch, optionalDate } = require("../util");
const { eventbriteOrganisers } = require("../config");

const BASE = "https://www.eventbrite.com/o/";

const dates = ds =>
  ds
    .map(s => s.replace(/(\d\d?:\d{2}) .*/, "$1").trim())
    .reduce(
      ([prev], curr) =>
        prev
          ? [
              prev,
              curr.match(/^\d\d?:\d{2}$/)
                ? `${prev.match(/(.*) \d\d?:\d{2}/)[1]} ${curr}`
                : curr
            ]
          : [curr],
      []
    )
    .map(s => new Date(s));

module.exports.indexEvents = async () =>
  Array.prototype.concat(
    ...(await Promise.all(
      eventbriteOrganisers.map(async id => {
        const $ = await fetch(`${BASE}${id}`);
        return $("#live_events .js-d-poster")
          .map((i, el) => ({
            title: $(el).attr("data-share-name"),
            url: $(el).attr("data-share-url")
          }))
          .get();
      })
    ))
  );

module.exports.fetchDetails = async ({ url }) => {
  const $ = await fetch(url);
  const [start, end] = dates(
    $("[data-automation='event-details-time'] :not(.hide-small)")
      .map((i, el) => $(el).html())
      .get()
      .slice(0, 2)
      .join(" ")
      .split("&#x2013;")
  );
  return {
    description:
      $(".js-xd-read-more-contents div div:first-child").text() ||
      cheerio
        .load(
          $(".js-xd-read-more-contents p:first-child")
            .html()
            .replace(/<br>.*/g, "")
        )
        .text()
        .trim(),
    location: $(
      ".event-details__data + .label-primary + .event-details__data p"
    )
      .map((i, el) => $(el).html())
      .get()
      .slice(0, 2)
      .join(", ")
      .trim(),
    start,
    end
  };
};
