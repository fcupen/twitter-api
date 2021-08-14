var express = require("express");
const { format } = require("date-fns");
var router = express.Router();
var fs = require("fs");

function timezoneOffset(d) {
  d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
  return d;
}

/* GET users listing. */
router.get("/", (req, res, next) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    let data_json = JSON.parse(data);

    const max = data_json.tweets.reduce((p, n) => {
      return timezoneOffset(new Date(n.date)).getTime() > p ? timezoneOffset(new Date(n.date)).getTime() : p;
    }, -Infinity);

    res.render("index", {
      title: "Express",
      tweets: data_json.tweets.map((tweet) => {
        const d = new Date(tweet.date);
        let dateUTC = timezoneOffset(d);
        const date = format(dateUTC, "dd/MM/yyyy HH:mm  zzzz");
        let current =  0
        return {
          ...tweet,
          date,
          tweet: tweet,
          max: max / 1000,
          current,
        };
      }),
    });
  });
});

module.exports = router;
