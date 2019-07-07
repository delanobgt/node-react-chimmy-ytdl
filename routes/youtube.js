const router = require("express").Router();
const controller = require("../controllers/youtube");

router.post("/sendShareLinkEmail", controller.sendShareLinkEmail);
router.post("/validateUrl", controller.validateUrl);
router.post("/basicInfo", controller.getBasicInfo);

router.get("/download/video", controller.downloadVideo);
router.get("/download/audio", controller.downloadAudio);
router.get("/download/files", controller.downloadFile);

module.exports = router;
