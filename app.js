require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const methodOverride = require("method-override");
const morgan = require("morgan");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");

(async function init() {
  const util = require("util");
  const fs = require("fs");

  const fsExist = util.promisify(fs.exists);
  const fsMkdir = util.promisify(fs.mkdir);

  if (!(await fsExist("./downloads"))) await fsMkdir("./downloads");
})();

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
    hostUrl: `http://${req.get("host")}`
  };
  next();
});
app.use("/youtube", require("./routes/youtube"));

app.use(express.static(path.join(__dirname, "downloads")));
app.use(express.static(path.join(__dirname, "client", "build")));
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

  const fsExist = util.promisify(fs.exists);
  const fsMkdir = util.promisify(fs.mkdir);

  // return;

  const url = "https://www.youtube.com/watch?v=Dd8pYdpyfnw";
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
    .filter(f => f.type.includes("audio") && f.type.includes("mp4"))
    .value();
  console.log("hehe", obj.formats);

  // fs.writeFile("basic_info.txt", JSON.stringify(obj, 2, 2), err => {
  //   if (err) console.log(err);
  // });

  // if (!(await fsExist("downloads"))) await fsMkdir("downloads");
  // if (!(await fsExist(path.join("downloads", obj.video_id))))
  //   await fsMkdir(path.join("downloads", obj.video_id));

  ytdl(obj.video_url, { filter: "audio" })
    .on("progress", (a, b, c) => {
      console.log(a, b, c, ((b / c) * 100).toFixed(2));
    })
    .pipe(fs.createWriteStream("./song.mp3"))
    .on("finish", () => {
      console.log("finish", "./song.mp3");
    });

  // console.log("start downloading");
  // const promises = _.map(
  //   obj.formats,
  //   f =>
  //     new Promise(async (resolve, reject) => {
  //       try {
  //         const filename = path.join(
  //           "downloads",
  //           `${obj.video_id}`,
  //           `${obj.video_id}_${f.quality || f.quality_label}.mp4`
  //         );
  //         console.log("start", filename);

  //         ytdl(obj.video_url, { format: f })
  //           .pipe(fs.createWriteStream(filename))
  //           .on("finish", () => {
  //             console.log("finish", filename);
  //             resolve();
  //           })
  //           .on("error", error => {
  //             console.log("what", { error });
  //           });
  //       } catch (error) {
  //         console.log({ error });
  //         reject(error);
  //       }
  //     })
  // );
  // console.log("there are", promises.length, "promises");
  // await Promise.all(promises);
  // console.log("finish downloading");

  // const f = obj.formats[0];
  // const filename = path.join(
  //   __dirname,
  //   "downloads",
  //   `${obj.video_id}`,
  //   `${obj.video_id}_${f.quality || f.quality_label}.mp4`
  // );
  // console.log("start downloading");
  // await new Promise(async (resolve, reject) => {
  //   try {
  //     console.log("start", filename);

  //     ytdl(obj.video_url, { format: f })
  //       .on("progress", (a, b, c) => {
  //         console.log(a, b, c, ((b / c) * 100).toFixed(2));
  //       })
  //       .pipe(fs.createWriteStream(filename))
  //       .on("finish", () => {
  //         console.log("finish", filename);
  //         resolve();
  //       })
  //       .on("error", error => {
  //         console.log("what", { error });
  //       });
  //   } catch (error) {
  //     console.log({ error });
  //     reject(error);
  //   }
  // });

  // return;
  // const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
  // const ffmpeg = require("fluent-ffmpeg");
  // ffmpeg.setFfmpegPath(ffmpegPath);

  // const songFilePath = "song.mp3";
  // const videoFilePath = "video.mp4";
  // const combinedFileName = `combined.mp4`;
  // const combinedFilePath = path.join(".", combinedFileName);
  // ffmpeg(videoFilePath)
  //   .addInput(songFilePath)
  //   // .outputOptions("-strict", "-2", "-map", "0:0", "-map", "1:0")
  //   // .outputOptions("-c:v", "copy", "-c:a", "copy")
  //   .outputOptions("-c:v", "copy", "-c:a", "aac", "-strict", "experimental")
  //   // .toFormat("mp4")
  //   .on("error", function(err) {
  //     console.log("combinedFilePath", err);
  //     // res.status(500);
  //     // delayed.end(null, {
  //     //   error: { msg: "ytdl combine failed" }
  //     // });
  //   })
  //   .on("progress", e => {
  //     console.log(e);
  //   })
  //   .on("end", function() {
  //     // console.log("finished merge");
  //     // delayed.end(null, {
  //     //   downloadUrl: `${
  //     //     req.locals.hostUrl
  //     //   }/youtube/download/files?filename=${combinedFileName}`
  //     // });
  //   })
  //   .save(combinedFilePath);

  // {
  //   const outPath = "./song.mp3";
  //   const inPath = "./video.mp4";
  //   ffmpeg(inPath)
  //     .format("mp3")
  //     .on("end", function() {
  //       console.log("conversion ended");
  //     })
  //     .on("error", function(err) {
  //       console.log("error: ", { err });
  //     })
  //     .output(outPath)
  //     .run();
  // }

  // {
  //   const videoPath = "./video.mp4";
  //   const audioPath = "./song.mp3";
  //   const outPath = "./combined.mp4";
  //   const outPath1 = "./combined.avi";
  //   ffmpeg(audioPath)
  //     .addInput(videoPath)
  //     // .outputOptions("-strict", "-2", "-map", "0:0", "-map", "1:0")
  //     .outputOptions("-c:v", "copy", "-c:a", "copy")
  //     .toFormat("mp4")
  //     .on("end", function() {
  //       console.log("conversion ended 1");
  //       // ffmpeg(outPath)
  //       //   .toFormat("avi")
  //       //   .on("end", function() {
  //       //     console.log("conversion ended 2");
  //       //   })
  //       //   .save(outPath1);
  //     })
  //     .on("error", function(err) {
  //       console.log("error: ", err);
  //     })
  //     .on("progress", e => {
  //       console.log({ e });
  //     })
  //     .save(outPath);
  // }
})();
