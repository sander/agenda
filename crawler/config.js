module.exports.root = "./data";
module.exports.sources = [
  "org.waag",
  "nl.dezwijger",
  "nl.hetnieuweinstituut",
  "com.meetup",
  "com.eventbrite"
];

/*
 * Use https://secure.meetup.com/meetup_api/console/?path=/2/groups
 * to get a Meetup group ID.
 */
module.exports.meetupGroups = {
  [21520976]: "Strategic Design Sandbox",
  [18299438]: "Amsterdam User Experience Designers",
  [20307541]: "Service Design Network Netherlands: Workouts",
  [21389794]: "Dutch Design Month",
  [9210352]: "HACKERS & DESIGNERS",
  [8865472]: "Amsterdam UX",
  [18994920]: "Ladies that UX Amsterdam Meetup",
  [19717860]: "Booking.com UX Meetup",
  [1988381]: "Rotterdam UX Cocktail Hours",
  [18571902]: "Startup Boot Businesses Networking Meetup"
};

module.exports.eventbriteOrganisers = [
  "thingscon-amsterdam-14961243701",
  "fuckup-nights-amsterdam-9386511841"
];
