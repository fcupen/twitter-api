var express = require("express");
var router = express.Router();
var fs = require("fs");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
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
/* PUT TWEET. */
router.put("/:id", function (req, res, next) {
  var tweet = req.body;
  const id = req.params.id;
  fs.readFile("./db/db.json", (err, data) => {
    let tweets = JSON.parse(data).tweets;
    tweets[Number(id)] = tweet;
    fs.writeFile("./db/db.json", JSON.stringify({ tweets }), (err) => {
      if (err) throw err;
      res.json({ tweets });
    });
  });
});
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

module.exports = router;
