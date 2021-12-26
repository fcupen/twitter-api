var express = require("express");
var router = express.Router();
const config_1 = require("../instagram/config/config");
const instagramConfig = config_1.credentialsInstagram;
const IG = require("../instagram/core/client.js");
const ig = new IG.IgApiClient();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const multer = require("multer");
const upload = multer();
let loggedInUser = {};
const CONFIGInstagram = {
  headerSingleInstagram: "c7EET9be4-fRU5-4900-8451-4976YDFb9a94-18999864",
  reset: "pgw9MCQGKg6jZJQ1xy_ia8mSG1BiM4FzCKl7majp",
};
function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }
  // console.log({matches});
  response.type = matches[1];
  response.data = Buffer.from(matches[2], "base64");

  return response;
}
router.post("/connect", (req, res) => {
  const headers = req.headers;
  if (headers.authorization === CONFIGInstagram.headerSingleInstagram) {
    ig.state.generateDevice(instagramConfig.username);
    ig.account
      .login(instagramConfig.username, instagramConfig.password)
      .then((user) => {
        loggedInUser = user;
        const response = {
          status: "OK-200",
          data: { msg: "connect", loggedInUser },
        };
        console.log("OK-200");
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: "BadRequest-400",
          data: { error },
        };
        res.status(400).send(response);
      });
  } else {
    const response = {
      status: "Unauthorized-401",
      data: { error: "No tiene permisos." },
    };
    res.status(401).send(response);
  }
});
router.get("/all-pending", (req, res) => {
  const headers = req.headers;
  if (headers.authorization === CONFIGInstagram.headerSingleInstagram) {
    process.nextTick(async () => ig.simulate.postLoginFlow());
    ig.feed
      .directPending()
      .items()
      .then((feed) => {
        const response = {
          status: "OK-200",
          data: { feed },
        };
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: "BadRequest-400",
          data: { error },
        };
        res.status(400).send(response);
      });
  } else {
    const response = {
      status: "Unauthorized-401",
      data: { error: "No tiene permisos." },
    };
    res.status(401).send(response);
  }
});
router.get("/all-direct", (req, res) => {
  const headers = req.headers;
  if (headers.authorization === CONFIGInstagram.headerSingleInstagram) {
    process.nextTick(async () => ig.simulate.postLoginFlow());
    ig.feed
      .directInbox()
      .items()
      .then((feed) => {
        const response = {
          status: "OK-200",
          data: { feed },
        };
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: "BadRequest-400",
          data: { error },
        };
        res.status(400).send(response);
      });
  } else {
    const response = {
      status: "Unauthorized-401",
      data: { error: "No tiene permisos." },
    };
    res.status(401).send(response);
  }
});
router.get("/all-posts", (req, res) => {
  const headers = req.headers;
  if (headers.authorization === CONFIGInstagram.headerSingleInstagram) {
    process.nextTick(async () => ig.simulate.postLoginFlow());
    const userFeed = ig.feed.user(loggedInUser.pk);
    userFeed
      .items()
      .then((feed) => {
        const response = {
          status: "OK-200",
          data: { feed },
        };
        res.status(200).send(response);
      })
      .catch((error) => {
        const response = {
          status: "BadRequest-400",
          data: { error },
        };
        res.status(400).send(response);
      });
  } else {
    const response = {
      status: "Unauthorized-401",
      data: { error: "No tiene permisos." },
    };
    res.status(401).send(response);
  }
});
router.post("/send", (req, res) => {
  const body = req.body;
  const headers = req.headers;
  if (headers.authorization === CONFIGInstagram.headerSingleInstagram) {
    process.nextTick(async () => ig.simulate.postLoginFlow());
    ig.user.getIdByUsername(body.username).then((userId) => {
      const thread = ig.entity.directThread([userId.toString()]);
      thread
        .broadcastText(body.message)
        .then(() => {
          const response = {
            status: "NoContent-204",
            data: { body },
          };
          res.status(204).send(response);
        })
        .catch((error) => {
          const response = {
            status: "BadRequest-400",
            data: { error },
          };
          res.status(400).send(response);
        });
    });
  } else {
    const response = {
      status: "Unauthorized-401",
      data: { error: "No tiene permisos." },
    };
    res.status(401).send(response);
  }
});

// 1000X1000 JPG
router.post("/post-photo", upload.any(), (req, res) => {
  const body = req.body;
  const headers = req.headers;
  ig.state.generateDevice(instagramConfig.username);
  const request = {
    file: decodeBase64Image(body.media_data).data,
    caption: body.tweet,
  };
  // console.log({ request });
  ig.publish
    .photo(request)
    .then((photo) => {
      const response = {
        status: "Created-201",
        data: { photo },
      };
      res.status(201).send(response);
    })
    .catch((error) => {
      const response = {
        status: "BadRequest-400",
        data: { error },
      };
      res.status(400).send(response);
    });
});
router.post("/post-video", upload.any(), (req, res) => {
  const body = req.body;
  const headers = req.headers;
  if (headers.authorization === CONFIGInstagram.headerSingleInstagram) {
    ig.state.generateDevice(instagramConfig.username);
    const request = {
      video: req.files[0].buffer,
      coverImage: req.files[1].buffer,
    };
    ig.publish
      .video(request)
      .then((photo) => {
        const response = {
          status: "Created-201",
          data: { photo },
        };
        res.status(201).send(response);
      })
      .catch((error) => {
        const response = {
          status: "BadRequest-400",
          data: { error },
        };
        res.status(400).send(response);
      });
  } else {
    const response = {
      status: "Unauthorized-401",
      data: { error: "No tiene permisos." },
    };
    res.status(401).send(response);
  }
});
router.post("/post-album", upload.any(), (req, res) => {
  const body = req.body;
  const headers = req.headers;
  if (headers.authorization === CONFIGInstagram.headerSingleInstagram) {
    ig.state.generateDevice(instagramConfig.username);
    const request = {
      items: [req.files[0].buffer],
    };
    ig.publish
      .video(request)
      .then((photo) => {
        const response = {
          status: "Created-201",
          data: { photo },
        };
        res.status(201).send(response);
      })
      .catch((error) => {
        const response = {
          status: "BadRequest-400",
          data: { error },
        };
        res.status(400).send(response);
      });
  } else {
    const response = {
      status: "Unauthorized-401",
      data: { error: "No tiene permisos." },
    };
    res.status(401).send(response);
  }
});
router.post("/post-story", upload.any(), (req, res) => {
  const body = req.body;
  const headers = req.headers;
  // if (headers.authorization === CONFIGInstagram.headerSingleInstagram) {
  ig.state.generateDevice(instagramConfig.username);
  const request = {
    file: decodeBase64Image(body.media_data).data,
  };
  ig.publish
    .story(request)
    .then((photo) => {
      const response = {
        status: "Created-201",
        data: { photo },
      };
      res.status(201).send(response);
    })
    .catch((error) => {
      const response = {
        status: "BadRequest-400",
        data: { error },
      };
      res.status(400).send(response);
    });
  // } else {
  //   const response = {
  //     status: "Unauthorized-401",
  //     data: { error: "No tiene permisos." },
  //   };
  //   res.status(401).send(response);
  // }
});
module.exports = router;
