const express = require('express');
const Hosteller = require('../../Model/Administration/Hosteller');

const hostellerMonthlyUpdate = async () => {
    
    try {
        const result = await Hosteller.updateMany(
            { trash: "NO" },
            { $set: { rent_status: 1, rent_paid: 0 } }
        );
    } catch (err) {
        console.error("Cron job error:", err.message);
    }
}

module.exports = {
    hostellerMonthlyUpdate
}