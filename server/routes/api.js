var express = require("express");
var router = express.Router();
var fs = require("fs");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// var cron = require("node-cron");

// var Twitter = require("twitter");
// var client = new Twitter({
//   consumer_key: process.env.consumer_key,
//   consumer_secret: process.env.consumer_secret,
//   access_token_key: process.env.access_token_key,
//   access_token_secret: process.env.access_token_secret,
// });

/* GET TWEETS. */
router.get("/", function (req, res, next) {
  fs.readFile("./db/db.json", (err, data) => {
    let data_json = JSON.parse(data);
    res.json(data_json);
  });
});
/* POST TWEET. */
const timezone = 1000 * 60 * 60;
router.post("/", function (req, res, next) {
  var tweet = req.body;
  fs.readFile("./db/db.json", (err, data) => {
    let tweets = JSON.parse(data).tweets;
    const tweetFilter = tweet.filter(
      (t) => new Date(t.date).getTime() - new Date().getTime() - timezone > 0
    );
    tweets.unshift(...tweetFilter);
    fs.writeFile("./db/db.json", JSON.stringify({ tweets: tweets }), (err) => {
      if (err) throw err;
      res.json({ tweets: tweets });
    });
  });
});
// function timerTweet(tweet) {}
// /* PUT TWEET. */
// router.put("/:id", function (req, res, next) {
//   var tweet = req.body;
//   const id = req.params.id;
//   fs.readFile("./db/db.json", (err, data) => {
//     let tweets = JSON.parse(data).tweets;
//     tweets[Number(id)] = tweet;
//     fs.writeFile("./db/db.json", JSON.stringify({ tweets }), (err) => {
//       if (err) throw err;
//       res.json({ tweets });
//     });
//   });
// });
/* DELETE TWEET. */
router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  fs.readFile("./db/db.json", (err, data) => {
    let tweets = JSON.parse(data);
    tweets.tweets.splice(id, 1);
    fs.writeFile(
      "./db/db.json",
      JSON.stringify({ tweets: tweets.tweets }),
      (err) => {
        if (err) throw err;
        res.json({ tweets: tweets.tweets });
      }
    );
  });
});

// console.log("running CRON");
// let sg = 0;
// setInterval(() => {
//   console.log(++sg);
// }, 1000);
// cron.schedule("*/1 * * * *", () => {
//   console.log("check");
//   fs.readFile("./db/db.json", (err, data) => {
//     let tweets = JSON.parse(data).tweets;
//     console.log(tweets);
//     tweets = tweets.forEach((t) => {
//       const left = new Date(t.date).getTime() - new Date().getTime() - timezone;
//       console.log(left);
//       if (left < 0) {
//         client.post(
//           "statuses/update",
//           { status: t.tweet },
//           (error, tweet_, response) => {
//             if (error) throw error;
//             console.log({ error, tweet_, response });
//           }
//         );
//       }
//       return left > 0;
//     });
//     fs.writeFile("./db/db.json", JSON.stringify({ tweets }), (err) => {
//       if (err) throw err;
//     });
//   });
// });

module.exports = router;
