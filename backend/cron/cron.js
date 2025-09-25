const cron = require("node-cron");
const cronjobcontroller = require('../Controller/Admin/CronJobController.js');
const CRON_TIMEZONE = process.env.TIMEZONE;

cron.schedule(
    "0 1 1 * *",
    cronjobcontroller.hostellerMonthlyUpdate,
    {
        scheduled: true,
        timezone: CRON_TIMEZONE,
    }
);


