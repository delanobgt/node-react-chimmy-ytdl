const _ = require("lodash");
const moment = require("moment");
const ytdl = require("ytdl-core");

exports.validateUrl = async (req, res) => {
  const { url } = req.body;
  const valid = await ytdl.validateURL(url);
  res.json({ valid });
};

exports.getBasicInfo = async (req, res) => {
  const { url } = req.body;
  const basicInfo = await ytdl.getBasicInfo(url);
  res.json(basicInfo);
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
