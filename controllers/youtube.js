const _ = require("lodash");
const moment = require("moment");
const ytdl = require("ytdl-core");
const util = require("util");
const fs = require("fs");
const path = require("path");
const DelayedResponse = require("http-delayed-response");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const fsExist = util.promisify(fs.exists);
const fsMkdir = util.promisify(fs.mkdir);

const mailer = require("../services/mailer");

exports.sendShareLinkEmail = async (req, res) => {
  const { videoUrl, videoName, email } = req.body;
  try {
    await mailer.sendShareLinkEmail({
      recipientEmail: email,
      payload: {
        videoUrl,
        videoName,
        originUrl: req.locals.originUrl
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: { msg: "Please try again!" } });
  }
};

exports.validateUrl = async (req, res) => {
  const { url } = req.body;
  const valid = await ytdl.validateURL(url);
  res.json({ valid });
};

exports.getBasicInfo = async (req, res) => {
  const { url } = req.body;
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
    "age_restricted"
  ];

  const obj = _.omit(basicInfo, keys);
  obj.formats = _.chain(obj.formats)
    .filter(f => f.type.includes("mp4") && f.type.includes("video"))
    .uniqBy(f => f.quality || f.quality_label)
    .value();
  // console.log(obj.formats);
  // console.log(obj.formats.length);

  res.json(obj);
};

exports.downloadVideo = async (req, res) => {
  try {
    res.setTimeout(4 * 60 * 1000);
    const delayed = new DelayedResponse(req, res);
    delayed.json();
    delayed.start();

    const { url, format, q } = req.query;
    console.log("downloadVideo", { url, format, q });

    const basicInfo = await ytdl.getBasicInfo(url);
    basicInfo.title = basicInfo.title
      .replace(/[^\x20-\x7E]+/g, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    fs.writeFile("basic_info.txt", JSON.stringify(basicInfo, 2, 2), err => {
      if (err) console.log(err);
    });

    if (q === "medium") {
      const formats = _.chain(basicInfo.formats)
        .filter(
          f => f.type.includes("mp4") && f.type.includes("video") && f.quality
        )
        .value();
      const videoFileName = `${basicInfo.title}.mp4`;
      const videoFilePath = path.join(".", "downloads", videoFileName);
      ytdl(basicInfo.video_url, {
        format: formats[0]
      })
        .pipe(fs.createWriteStream(videoFilePath))
        .on("error", error => {
          console.log("videoFilePath", { error });
        })
        .on("finish", () => {
          delayed.end(null, {
            downloadUrl: `${
              req.locals.hostUrl
            }/youtube/download/files?filename=${videoFileName}`
          });
        });
    } else {
      const promises = [];

      const songFileName = `${basicInfo.title}.mp3`;
      const songFilePath = path.join(".", "downloads", songFileName);
      await new Promise((resolve, reject) => {
        console.log(basicInfo.video_url, { filter: "audioonly" });
        ytdl(basicInfo.video_url, { filter: "audioonly" })
          .on("progress", (a, b, c) => {
            console.log(a, b, c, ((b / c) * 100).toFixed(2));
          })
          .pipe(fs.createWriteStream(songFilePath))
          .on("error", error => {
            console.log("songFilePath", { error });
            reject({ error });
          })
          .on("finish", () => {
            console.log("finished downloading mp3");
            resolve();
          });
      });

      const noaudioFileName = `${basicInfo.title}-noaudio-${q}.mp4`;
      const noaudioFilePath = path.join(".", "downloads", noaudioFileName);
      await new Promise((resolve, reject) => {
        ytdl(basicInfo.video_url, {
          format: _.find(basicInfo.formats, f => f.quality_label === q)
        })
          .on("progress", (a, b, c) => {
            console.log(a, b, c, ((b / c) * 100).toFixed(2));
          })
          .pipe(fs.createWriteStream(noaudioFilePath))
          .on("error", error => {
            console.log("noaudioFilePath", { error });
            reject({ error });
          })
          .on("finish", () => {
            console.log("finish downloading noaudio");
            resolve();
          });
      });

      // await Promise.all(promises);

      const combinedFileName = `${basicInfo.title}_${q}.mp4`;
      const combinedFilePath = path.join(".", "downloads", combinedFileName);
      ffmpeg(noaudioFilePath)
        .addInput(songFilePath)
        .outputOptions("-c:v", "copy", "-c:a", "aac", "-strict", "experimental")
        // .toFormat("mp4")
        .on("error", function(err) {
          console.log("combinedFilePath", err);
          res.status(500);
          delayed.end(null, {
            error: { msg: "ytdl combine failed" }
          });
        })
        .on("progress", e => {
          console.log(e);
        })
        .on("end", function() {
          console.log("finished merge");
          delayed.end(null, {
            downloadUrl: `${
              req.locals.hostUrl
            }/youtube/download/files?filename=${combinedFileName}`
          });
        })
        .save(combinedFilePath);
    }
  } catch (error) {
    console.log({ error });
    res.status(500);
    delayed.end(null, {
      error: { msg: "something is wrong" }
    });
  }
};

exports.downloadAudio = async (req, res) => {
  res.setTimeout(4 * 60 * 1000);
  const delayed = new DelayedResponse(req, res);
  delayed.json();
  delayed.start();

  const { url, format } = req.query;
  console.log("downloadAudio", { url, format });

  const basicInfo = await ytdl.getBasicInfo(url);
  basicInfo.title = basicInfo.title
    .replace(/[^\x20-\x7E]+/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_");

  const songFileName = `${basicInfo.title}.mp3`;
  const songFilePath = path.join(".", "downloads", songFileName);

  console.log("start");
  ytdl(basicInfo.video_url, { filter: "audioonly" })
    .on("progress", (a, b, c) => {
      console.log(a, b, c, ((b / c) * 100).toFixed(2));
    })
    .pipe(fs.createWriteStream(songFilePath))
    .on("error", function(err) {
      console.log("songFilePath", { err });
      res.status(500);
      delayed.end(null, {
        error: { msg: "ytdl download song failed" }
      });
    })
    .on("finish", function() {
      console.log("conversion to mp3 ended");
      if (format === "mp3") {
        console.log("if mp3");
        delayed.end(null, {
          downloadUrl: `${
            req.locals.hostUrl
          }/youtube/download/files?filename=${songFileName}`
        });
      } else {
        console.log("if " + format);

        const outFileName = `${basicInfo.title.replace(
          /[^a-zA-Z0-9-_]/g,
          " "
        )}.${format}`;
        const outFilePath = path.join(".", "downloads", outFileName);

        ffmpeg(songFilePath)
          .format(format)
          .on("error", function(err) {
            console.log("outFilePath", { err });
            res.status(500);
            delayed.end(null, {
              error: { msg: "convert song failed" }
            });
          })
          .on("end", function() {
            console.log(`conversion to ${format} ended`);
            delayed.end(null, {
              downloadUrl: `${
                req.locals.hostUrl
              }/youtube/download/files?filename=${outFileName}`
            });
          })
          .save(outFilePath);
      }
      res.on("finish", () => {
        console.log("res finish");
      });
    });
};

exports.downloadFile = (req, res) => {
  const { filename } = req.query;
  const filepath = path.join(__dirname, "..", "downloads", filename);
  res.download(filepath, filename);
};
