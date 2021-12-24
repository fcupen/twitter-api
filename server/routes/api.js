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
router.post("/:key", function (req, res, next) {
  const key = req.params.key;
  var tweet = req.body;
  fs.readFile("./db/db.json", (err, data) => {
    let db = JSON.parse(data)[key];
    if (db === "tweets") {
      const tweetFilter = tweet.filter(
        (t) => new Date(t.date).getTime() - new Date().getTime() - timezone > 0
      );
      db.unshift(...tweetFilter);
    } else {
      db.unshift(...tweet);
    }
    fs.writeFile(
      "./db/db.json",
      JSON.stringify({ ...JSON.parse(data), [key]: db }),
      (err) => {
        if (err) throw err;
        res.json({ ...JSON.parse(data), [key]: db });
      }
    );
  });
});
/* PUT TWEET. */
router.put("/:key/:id", function (req, res, next) {
  var tweet = req.body;
  const key = req.params.key;
  const id = req.params.id;
  fs.readFile("./db/db.json", (err, data) => {
    let db = JSON.parse(data)[key];
    db[Number(id)] = tweet;
    fs.writeFile(
      "./db/db.json",
      JSON.stringify({ ...data, [key]: db }),
      (err) => {
        if (err) throw err;
        res.json({ ...data, [key]: db });
      }
    );
  });
});
/* DELETE TWEET. */
router.delete("/:key/:id", function (req, res, next) {
  const id = req.params.id;
  const key = req.params.key;
  fs.readFile("./db/db.json", (err, data) => {
    let db = JSON.parse(data);
    db[key].splice(id, 1);
    fs.writeFile(
      "./db/db.json",
      JSON.stringify({ ...data, [key]: db[key] }),
      (err) => {
        if (err) throw err;
        res.json({ ...data, [key]: db[key] });
      }
    );
  });
});

module.exports = router;
