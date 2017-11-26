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

const { fetch } = require("../util");

const URL = "https://hetnieuweinstituut.nl/agenda";

const prepareDate = (s, isFirst) => {
  const english = s
    .replace("maa", "mar")
    .replace("mei", "may")
    .replace("okt", "oct");
  if (s.match(/\d+:\d{2}/)) return english;
  else return isFirst ? `${english} 11:00` : `${english} 17:00`;
};

const dates = ([first, second]) =>
  second
    ? {
        start: new Date(
          prepareDate(
            first.match(/\d{4}/)
              ? first
              : `${first} ${second.match(/\d{4}/)[0]}`,
            true
          )
        ),
        end: new Date(
          prepareDate(
            second.length === 5
              ? prepareDate(first, true).replace(/\d{2}:\d{2}/, second)
              : second,
            false
          )
        )
      }
    : { date: new Date(prepareDate(first, true)) };

module.exports.indexEvents = async () => {
  const $ = await fetch(URL);

  return $(".agenda-magazine, .agenda-event")
    .map((i, el) => ({
      url: $(el)
        .find("a")
        .attr("href"),
      suptitle: $(el)
        .find(".agenda-type")
        .text()
        .trim(),
      title: $(el)
        .find(".agenda-title")
        .text()
        .trim(),
      description: cheerio
        .load(
          $(el)
            .find(".event-body-teaser")
            .html()
            .replace(/<br>/g, " ")
        )
        .text()
        .trim(),
      ...dates(
        $(el)
          .find(".agenda-date")
          .html()
          .replace(/<.+>/g, "")
          .split(/&#x2014;/g)
          .map(s => s.trim())
      ),
      location: "Het Nieuwe Instituut, Rotterdam"
    }))
    .get();
};
