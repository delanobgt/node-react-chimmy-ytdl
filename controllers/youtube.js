const _ = require("lodash");
const moment = require("moment");
const ytdl = require("ytdl-core");
const util = require("util");
const fs = require("fs");
const path = require("path");

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
    // .filter(f => f.type.includes("mp4") && f.quality_label)
    // .filter(
    //   f =>
    //     f.type.includes("mp4") && f.type.includes("video") && !f.quality_label
    // )
    .filter(f => f.type.includes("mp4") && f.type.includes("video"))
    .uniqBy(f => f.quality || f.quality_label)
    // .sort(f => -Number(f.quality_label.slice(0, -1)))
    .value();
  console.log(obj.formats);
  console.log(obj.formats.length);

  res.json(obj);
};

exports.downloadVideo = async (req, res) => {
  const { url } = req.query;
  const basicInfo = await ytdl.getBasicInfo(url);

  console.log("download", { url });

  res.header(
    "Content-Disposition",
    `attachment; filename="${basicInfo.title + ".mp4"}"`
  );
  res.on("finish", () => {
    console.log("done");
  });
  ytdl(url, { filter: format => format.container === "mp4" }).pipe(res);
};
