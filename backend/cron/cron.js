const cron = require("node-cron");
const Hosteller = require("../Model/Administration/Hosteller");

const CRON_TIMEZONE = process.env.TIMEZONE;

cron.schedule(
    "0 1 1 * *",
    async () => {
        try {
            const result = await Hosteller.updateMany(
                { trash: "NO" },
                { $set: { rent_status: 1, rent_paid: 0 } }
            );
        } catch (err) {
            console.error("Cron job error:", err.message);
        }
    },
    {
        scheduled: true,
        timezone: CRON_TIMEZONE,
    }
);


