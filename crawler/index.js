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
const cheerio = require("cheerio");
const fs = require("fs");
const crypto = require("crypto");

const { root, sources } = require("./config");

const now = new Date();

const escape = str =>
  str
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

const hash = str =>
  escape(
    crypto
      .createHash("sha256")
      .update(str)
      .digest("base64")
  );

const stringify = v => JSON.stringify(v, null, 2);

const crawl = async () => {
  const mods = {};

  for (const tag of sources) {
    const { indexEvents, fetchDetails } = (mods[tag] = require(`./sources/${
      tag
    }`));

    console.info(`Indexing from ${tag}...`);

    const index = await indexEvents();
    const events = index.map(e => ({ ...e, id: hash(e.url), tag }));

    if (fetchDetails) {
      const handle = events.filter(
        ({ id }) => !fs.existsSync(`${root}/events/${id}`)
      );

      console.info(
        `Fetching ${handle.length}/${events.length} events from ${tag}...`
      );

      for (const event of handle) {
        const { id, url } = event;
        const content = Object.assign(
          event,
          { fetched: now },
          await fetchDetails(event)
        );
        fs.writeFileSync(`${root}/events/${id}`, stringify(content));
        console.log(`  ${content.title}`);
      }
    } else {
      for (const event of events)
        fs.writeFileSync(`${root}/events/${event.id}`, stringify(event));

      console.info(`Stored ${events.length}/${events.length} events.`);
    }

    console.info(`Done with ${tag}.`);
  }
};

const prepare = () => {
  const events = fs
    .readdirSync(`${root}/events`)
    .map(id => `${root}/events/${id}`)
    .map(path => fs.readFileSync(path))
    .map(JSON.parse)
    .filter(({ end, date }) => new Date(end || date) > now)
    .sort((a, b) => {
      const byDate = +new Date(a.end || a.date) - +new Date(b.end || b.date);
      if (byDate === 0) return a.title < b.title ? -1 : 1;
      else return byDate;
    });
  const output = {
    updated: new Date(),
    events
  };
  fs.writeFileSync(`${root}/index.json`, stringify(output));
};

const main = async () => {
  if (!fs.existsSync(root)) fs.mkdirSync(root);
  if (!fs.existsSync(`${root}/events`)) fs.mkdirSync(`${root}/events`);

  console.info("Crawling...");

  try {
    await crawl();
  } catch (e) {
    console.error("Error while crawling:", e);
    process.exit(1);
  }

  console.info("Done crawling. Preparing...");

  try {
    await prepare();
  } catch (e) {
    console.error("Error while preparing:", e);
    process.exit(1);
  }

  console.info("Done.");
};

main();
