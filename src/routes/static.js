const express = require("express");
const router = express.Router();
var CronJob = require('cron').CronJob;
const staticController = require("../controllers/staticController");

router.get("/", staticController.index);

const job = new CronJob('0 */10 * * * *', () => {
    router.get(router.get("/", staticController.index));
    console.log('ping');
});

job.start();

module.exports = router;