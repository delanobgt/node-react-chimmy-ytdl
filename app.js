require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const methodOverride = require("method-override");
const morgan = require("morgan");
const express = require("express");
const app = express();
const server = require("http").Server(app);

// App Setup
// app.use(
//   morgan("combined", {
//     skip: function(req, res) {
//       return res.statusCode < 400;
//     }
//   })
// );
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Routes Setup
const saveParams = (req, res, next) => {
  req.locals = { ...req.locals, ...req.params };
  next();
};
app.use((req, res, next) => {
  req.locals = {
    originUrl: req.get("origin"),
    hostUrl: `https://${req.get("host")}`
  };
  next();
});
app.use("/youtube", require("./routes/youtube"));

const path = require("path");
app.use(express.static(path.join("client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// Server Setup
const PORT = process.env.PORT || 3090;
server.listen(PORT, () => {
  console.log("\n\n\n");
  console.log(`Server listening on port ${PORT}.`);
  console.log("\n\n\n");
});

(async () => {
  const fs = require("fs");
  const _ = require("lodash");
  const ytdl = require("ytdl-core");

  const url = "https://www.youtube.com/watch?v=FfgrV7i5jrA";
  const response = await ytdl.getBasicInfo(url);
  const obj = response;
  // const obj = _.map(response.formats, fmt => fmt.type);
  // const obj = ytdl.filterFormats(response.formats, "video");
  console.log(obj.length);
  const keys = [
    "timestamp",
    "player_response",
    "status",
    "video_id",
    "title",
    "author",
    "host_language",
    "length_seconds",
    "formats",
    "published",
    "description",
    "media",
    "video_url",
    "age_restricted",
    "html5player"
  ];
  fs.writeFile("basic_info.txt", JSON.stringify(obj, 2, 2), err =>
    console.log(err)
  );
})();
