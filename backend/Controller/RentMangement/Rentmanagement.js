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

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const previousPaid = hosteller.rent_paid || 0;
        const totalPaid = previousPaid + Number(rent);

        let rent_status = 1; 

        if (totalPaid === hosteller.rent) {
            rent_status = 3; 
        } else if (totalPaid > 0 && totalPaid < hosteller.rent) {
            rent_status = 2; 
        }

        const rentLog = await Rentmanagement.findOne({
            hosteller_id: hosteller._id,
            month: currentMonth,
            year: currentYear,
        });


        if (!rentLog) {
            await Rentmanagement.create({
                hosteller_id: hosteller._id,
                total_rent: hosteller.rent,
                rent_paid: totalPaid,
                rent_status,
                year: currentYear,
                month: currentMonth,
            });
        } else {
            await Rentmanagement.updateOne(
                { _id: rentLog._id },
                {
                    $set: {
                        rent_paid: totalPaid,
                        rent_status,
                    },
                }
            );
        }

        hosteller.rent_status = rent_status;
        hosteller.rent_paid = totalPaid;
        await hosteller.save();

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