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
