const express = require('express');
const Hosteller = require('../../Model/Administration/Hosteller');
const Rentmanagement = require('../../Model/RentManagement/Rentmanagement');

const paidStatusUpdate = async (req, res) => {
    try {
        const { id, rent } = req.body;

        const hosteller = await Hosteller.findById(id);
        if (!hosteller) {
            return res.status(404).json({ message: "Hosteller not found" });
        }
        
        let rent_status = 1;
        if (hosteller.rent == rent) {
            rent_status = 3;
        } else if (rent > 0 && rent < hosteller.rent) {
            rent_status = 2;
        }

        hosteller.rent_status = rent_status;
        hosteller.paid_rent = rent;
        await hosteller.save();

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        await Rentmanagement.create({
            hosteller_id: hosteller._id,
            total_rent: hosteller.rent,
            rent_paid: rent,
            rent_status,
            year: currentYear,
            month: currentMonth,
        });

        res.status(200).json({
            message: "Rent updated successfully",
            data: hosteller,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    paidStatusUpdate,
}