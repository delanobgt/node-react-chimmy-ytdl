const _ = require("lodash");
const moment = require("moment");
const ytdl = require("ytdl-core");
const util = require("util");
const fs = require("fs");
const path = require("path");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");

const fsExist = util.promisify(fs.exists);
const fsMkdir = util.promisify(fs.mkdir);

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
  res.setTimeout(4 * 60 * 1000);

  const { url, format, q } = req.query;
  console.log("downloadVideo", { url, format, q });

  const basicInfo = await ytdl.getBasicInfo(url);
  basicInfo.title = basicInfo.title
    .replace(/[^\x20-\x7E]+/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_");
  basicInfo.formats = _.chain(basicInfo.formats)
    .filter(f => f.type.includes("mp4") && f.type.includes("video"))
    .value();

  const videoFileName = `${basicInfo.title}.mp4`;
  const videoFilePath = path.join(".", "downloads", videoFileName);
  ytdl(basicInfo.video_url, {
    format: _.find(basicInfo.formats, f => f.quality)
  })
    .pipe(fs.createWriteStream(videoFilePath))
    .on("error", error => {
      console.log("videoFilePath", { error });
    })
    .on("finish", () => {
      if (q === "medium") {
        console.log("if medium");
        res.json({
          downloadUrl: `${
            req.locals.hostUrl
          }/youtube/download/files?filename=${videoFileName}`
        });
      } else {
        console.log("else");
        const songFileName = `${basicInfo.title}.mp3`;
        const songFilePath = path.join(".", "downloads", songFileName);
        ffmpeg(videoFilePath)
          .format("mp3")
          .on("error", function(err) {
            console.log("songFilePath", { err });
          })
          .on("end", function() {
            console.log("conversion to mp3 ended");

            const noaudioFileName = `${basicInfo.title}-noaudio-${q}.mp4`;
            const noaudioFilePath = path.join(
              ".",
              "downloads",
              noaudioFileName
            );
            ytdl(basicInfo.video_url, {
              format: _.find(basicInfo.formats, f => f.quality_label === q)
            })
              .pipe(fs.createWriteStream(noaudioFilePath))
              .on("error", error => {
                console.log("noaudioFilePath", { error });
              })
              .on("finish", () => {
                const combinedFileName = `${basicInfo.title}_${q}.mp4`;
                const combinedFilePath = path.join(
                  ".",
                  "downloads",
                  combinedFileName
                );
                ffmpeg(songFilePath)
                  .addInput(noaudioFilePath)
                  // .outputOptions("-strict", "-2", "-map", "0:0", "-map", "1:0")
                  .outputOptions("-c:v", "copy", "-c:a", "copy")
                  .toFormat("mp4")
                  .on("error", function(err) {
                    console.log("combinedFilePath", err);
                  })
                  .on("progress", e => {
                    console.log({ e });
                  })
                  .on("end", function() {
                    console.log("merge ended");

                    const outFileName = `${basicInfo.title}_${q}.${format}`;
                    const outFilePath = path.join(
                      ".",
                      "downloads",
                      outFileName
                    );
                    if (format === "mp4") {
                      res.json({
                        downloadUrl: `${
                          req.locals.hostUrl
                        }/youtube/download/files?filename=${outFileName}`
                      });
                    } else {
                      ffmpeg(combinedFilePath)
                        .toFormat(format)
                        .on("error", function(err) {
                          console.log("outFilePath", err);
                        })
                        .on("end", function() {
                          console.log("conversion ended");
                          res.json({
                            downloadUrl: `${
                              req.locals.hostUrl
                            }/youtube/download/files?filename=${outFileName}`
                          });
                        })
                        .save(outFilePath);
                    }
                  })
                  .save(combinedFilePath);
              });
          })
          .save(songFilePath);
      }
    });
};

exports.downloadAudio = async (req, res) => {
  res.setTimeout(4 * 60 * 1000);

  const { url, format } = req.query;
  console.log("downloadAudio", { url, format });

  const basicInfo = await ytdl.getBasicInfo(url);
  basicInfo.title = basicInfo.title
    .replace(/[^\x20-\x7E]+/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_");
  basicInfo.formats = _.chain(basicInfo.formats)
    .filter(
      f =>
        f.type.includes("mp4") && f.type.includes("video") && !f.quality_label
    )
    .value();

  const videoFileName = `${basicInfo.title}.mp4`;
  const videoFilePath = path.join(".", "downloads", videoFileName);
  ytdl(basicInfo.video_url, { format: _.head(basicInfo.formats) })
    .pipe(fs.createWriteStream(videoFilePath))
    .on("error", error => {
      console.log("videoFilePath", { error });
    })
    .on("finish", () => {
      const songFileName = `${basicInfo.title}.mp3`;
      const songFilePath = path.join(".", "downloads", songFileName);
      ffmpeg(videoFilePath)
        .format("mp3")
        .on("error", function(err) {
          console.log("songFilePath", { err });
        })
        .on("end", function() {
          console.log("conversion to mp3 ended");
          if (format === "mp3") {
            console.log("if mp3");
            res.header(
              "Content-Disposition",
              `attachment; filename="${songFileName}"`
            );
            res.json({
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
              })
              .on("end", function() {
                console.log(`conversion to ${format} ended`);
                res.header(
                  "Content-Disposition",
                  `attachment; filename="${outFileName}"`
                );
                res.json({
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
        })
        .save(songFilePath);
    });
};

exports.downloadFile = (req, res) => {
  const { filename } = req.query;
  const filepath = path.join(__dirname, "..", "downloads", filename);
  res.download(filepath, filename);
};
