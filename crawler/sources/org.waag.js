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

const { fetch, optionalDate } = require("../util");

const URL = "http://waag.org/nl/events-2017";

module.exports.indexEvents = async () => {
  const $ = await fetch(URL);
  return $("#block-system-main td")
    .map((i, el) => ({
      url: $(el)
        .find("a")
        .attr("href")
    }))
    .get()
    .filter(({ url }) => url);
};

module.exports.fetchDetails = async ({ url }) => {
  const $ = await fetch(url);
  return Object.assign(
    {
      title: $("meta[property='og:title']").attr("content"),
      description: $("meta[name='description']").attr("content"),
      location: $(".field-name-field-location .field-items").text()
    },
    optionalDate(
      "start",
      $(
        "#block-system-main .field-name-field-event-date .date-display-start"
      ).attr("content")
    ),
    optionalDate(
      "end",
      $(
        "#block-system-main .field-name-field-event-date .date-display-end"
      ).attr("content")
    ),
    optionalDate(
      "date",
      $(
        "#block-system-main .field-name-field-event-date .date-display-single"
      ).attr("content")
    )
  );
};
