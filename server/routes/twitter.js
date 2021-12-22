var express = require("express");
var router = express.Router();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var Twitter = require("twitter");
var client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret,
});
/* GET LAST TWEETS. */
router.get("/", (req, res, next) => {
  client.get("statuses/home_timeline", (error, tweet, response) => {
    if (error) throw error;
    console.log(response);
  });
});
/* POST A TWEET. */
router.post("/", (req, res, next) => {
  var tweet = req.body.tweet;

  client.post(
    "statuses/update",
    { status: tweet },
    (error, tweet, response) => {
      if (error) throw error;
      res.json({ response });
    }
  );
});

/* STREAM TWEET. */
router.post("/stream", (req, res, next) => {
  var stream = client.stream("statuses/filter",
  // { track: "javascript" }
  { follow: "876596261931155456" }
  );
  stream.on("data", function (event) {
    console.log(event && event.text);
  });

  stream.on("error", function (error) {
    throw error;
  });
});

module.exports = router;
