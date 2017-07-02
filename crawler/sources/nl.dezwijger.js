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
