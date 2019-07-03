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
  const _ = require("lodash");
  const ytdl = require("ytdl-core");
  const util = require("util");
  const fs = require("fs");
  const path = require("path");

  const fsExist = util.promisify(fs.exists);
  const fsMkdir = util.promisify(fs.mkdir);

  return;

  const url = "https://www.youtube.com/watch?v=HuC2MUmQaG4";
  const basicInfo = await ytdl.getBasicInfo(url);
  const keys = [
    "fexp",
    "gapi_hint_params",
    "ssl",
    "innertube_api_version",
    "csi_page_type",
    "c",
    "watermark",
    "status",
    "ucid",
    "hl",
    "account_playback_token",
    "fflags",
    "enablecsi",
    "enabled_engage_types",
    "vss_host",
    "root_ve_type",
    "innertube_api_key",
    "host_language",
    "cver",
    "timestamp",
    "streamingData",
    "innertube_context_client_version",
    "csn",
    "cr",
    "media",
    "age_restricted",
    "",
    "",
    ""
  ];
  const obj = _.omit(basicInfo, keys);
  obj.formats = _.chain(obj.formats)
    // .filter(f => f.type.includes("mp4") && f.quality_label)
    // .filter(
    //   f =>
    //     f.type.includes("mp4") && f.type.includes("video") && !f.quality_label
    // )
    .filter(f => f.type.includes("mp4") && f.type.includes("video"))
    // .uniqBy(f => f.quality_label)
    // .sort(f => -Number(f.quality_label.slice(0, -1)))
    .value();
  console.log(obj.formats);

  fs.writeFile("basic_info.txt", JSON.stringify(obj, 2, 2), err => {
    if (err) console.log(err);
  });

  if (!(await fsExist("downloads"))) await fsMkdir("downloads");
  if (!(await fsExist(path.join("downloads", obj.video_id))))
    await fsMkdir(path.join("downloads", obj.video_id));

  console.log("start downloading");
  const promises = _.map(
    obj.formats,
    f =>
      new Promise(async (resolve, reject) => {
        try {
          const filename = path.join(
            "downloads",
            `${obj.video_id}`,
            `${obj.video_id}_${f.quality || f.quality_label}.mp4`
          );
          console.log("start", filename);

          ytdl(obj.video_url, { format: f })
            .pipe(fs.createWriteStream(filename))
            .on("finish", () => {
              console.log("finish", filename);
              resolve();
            })
            .on("error", error => {
              console.log("what", { error });
            });
        } catch (error) {
          console.log({ error });
          reject(error);
        }
      })
  );
  console.log("there are", promises.length, "promises");
  await Promise.all(promises);
  console.log("finish downloading");
})();
