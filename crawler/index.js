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
    .sort((a, b) => +new Date(a.end || a.date) - +new Date(b.end || b.date));
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
