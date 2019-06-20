const router = require("express").Router();
const controller = require("../controllers/youtube");

router.post("/validateUrl", controller.validateUrl);
router.post("/basicInfo", controller.getBasicInfo);

router.get("/download", controller.downloadVideo);

module.exports = router;
