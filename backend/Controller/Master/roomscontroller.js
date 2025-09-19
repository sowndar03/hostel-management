const express = require('express');
const Rooms = require('../../Model/Master/Rooms');
const { body, validationResult } = require('express-validator');
const helper = require('../../utils/helper');
const Hostel = require('../../Model/Master/Hostel');
const Building = require('../../Model/Master/Building');
const Location = require('../../Model/Master/Location');
const Upload = require('../../Model/Administration/Upload');
const Roomstatus = require('../../Model/Master/Roomstatus');


const list = async (req, res) => {
    try {
        const rooms = await Rooms.find({ trash: "NO" })
            .populate("location_id", "location_name")
            .populate("hostel_id", "hostel_name")
            .populate("building_id", "building_name")
            .populate("created_by", "name");

        const roomsWithCount = await Promise.all(
            rooms.map(async (room) => {
                const count = await Roomstatus.countDocuments({
                    room_id: room._id,
                    seat_status: "1",
                });
                return {
                    ...room.toObject(),
                    availableSeats: count,
                };
            })
        );

        res.status(200).json({ data: roomsWithCount });

        res.status(200).json({ data: roomsWithCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const store = async (req, res) => {
    await Promise.all([
        body("location_id")
            .trim()
            .notEmpty().withMessage("Location is Required")
            .run(req),
        body("hostel_id")
            .trim()
            .notEmpty().withMessage("Hostel is Required")
            .run(req),
        body("building_id")
            .trim()
            .notEmpty().withMessage("Building is Required")
            .run(req),
        body("room_no")
            .trim()
            .notEmpty().withMessage("Room Number is Required")
            .run(req),
        body("room_count")
            .trim()
            .notEmpty().withMessage("Room Count is Required")
            .run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { location_id, hostel_id, building_id, room_no, room_count } = req.body;
        const result = new Rooms({
            location_id,
            hostel_id,
            building_id,
            room_count,
            available_count: room_count,
            room_no,
            created_by: req.user.id,
        });

        for (let i = 0; i < room_count; i++) {
            const roomstatus = new Roomstatus({ room_id: result._id, seat_no: i + 1, seat_status: 1, user_id: null, created_by: req.user.id, });
            await roomstatus.save();
        }

        await result.save();
        res.status(201).json({
            message: 'Rooms Added Successfully',
            data: result,
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        })
    }
}

const uniqueCheck = async (req, res) => {
    try {
        const { location_id, hostel_id, building_id, room_no, id } = req.body;

        const result = await Rooms.findOne({ location_id, hostel_id, building_id, room_no });

        if (result) {
            if (id && result._id.toString() === id) {
                return res.json({ message: "Available" });
            }
            return res.json({ message: "Rooms Already Exists" });
        }
        return res.json({ message: "Available" });

    } catch (err) {
        return res.json({ message: err.message });
    }
};

const statusChange = async (req, res) => {
    try {
        const { id, status } = req.body;
        const changedStatus = status == 0 ? 1 : 0;

        try {
            const result = await Rooms.findByIdAndUpdate(
                id,
                { status: changedStatus },
                { new: true }
            );
            await Roomstatus.updateMany(
                { room_id: id },
                { $set: { status: changedStatus } }
            );

            res.status(200).json({
                success: true,
                message: "Status updated successfully",
                data: result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const deleteHostel = async (req, res) => {
    try {
        const { id } = req.body;

        try {
            const result = await Rooms.findByIdAndUpdate(
                id,
                { trash: 'YES', status: '0' },
                { new: true }
            );

            await Roomstatus.updateMany(
                { room_id: id },
                { $set: { trash: "YES", status: "0" } }
            );

            res.status(200).json({
                success: true,
                message: "Deleted successfully",
                data: result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const selectOne = async (req, res) => {
    const { id } = req.params;

    try {

        const buildings = await Rooms.findOne({ _id: id, trash: "NO" })
            .populate("location_id", "location_name")
            .populate("hostel_id", "hostel_name")
            .populate("building_id", "building_name")
            .populate("created_by", "name");

        if (!buildings) {
            return res.status(404).json({
                success: false,
                message: "Rooms not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Fetched successfully",
            data: buildings,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }

}
const updates = async (req, res) => {
    try {
        const { building_id, hostel_id, location_id, room_no, room_count, id } = req.body;

        const result = await Rooms.findByIdAndUpdate(
            id,
            { location_id, hostel_id, building_id, room_count, room_no },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: "Room not found" });
        }

        const rooms_status = await Roomstatus.find({ room_id: id, trash: { $ne: "YES" } });

        if (room_count < rooms_status.length) {
            const extraSeats = rooms_status.length - room_count;
            const seatsToRemove = await Roomstatus.find({ room_id: id, trash: { $ne: "YES" } })
                .sort({ seat_no: -1 })
                .limit(extraSeats);

            const seatIds = seatsToRemove.map(s => s._id);
            await Roomstatus.updateMany(
                { _id: { $in: seatIds } },
                { $set: { trash: "YES", status: 0 } }
            );

        } else if (room_count > rooms_status.length) {
            const needSeats = room_count - rooms_status.length;

            const existingTrashed = await Roomstatus.find({ room_id: id, trash: "YES" }).sort({ seat_no: 1 });
            const seatsToReuse = existingTrashed.slice(0, needSeats);

            if (seatsToReuse.length > 0) {
                const reuseIds = seatsToReuse.map(s => s._id);
                await Roomstatus.updateMany(
                    { _id: { $in: reuseIds } },
                    { $set: { trash: "NO", status: 1 } }
                );
            }

            const stillNeed = needSeats - seatsToReuse.length;
            if (stillNeed > 0) {
                const lastSeat = await Roomstatus.findOne({ room_id: id }).sort({ seat_no: -1 });
                let startNo = lastSeat ? Number(lastSeat.seat_no) + 1 : 1;

                const newSeats = [];
                for (let i = 0; i < stillNeed; i++) {
                    newSeats.push({
                        room_id: id,
                        seat_no: String(startNo + i),
                        seat_status: 1,
                        user_id: null,
                        trash: "NO",
                        created_by: req.user.id,
                    });
                }

                await Roomstatus.insertMany(newSeats);
            }
        }

        return res.json({ message: "Updated successfully", data: result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

const searchValues = async (req, res) => {

    const { location_id, hostel_id, building_id, room_no, room_count, status } = req.body;
    let query = {};

    if (location_id && location_id !== "") {
        query.location_id = location_id;
    }

    if (hostel_id && hostel_id !== "") {
        query.hostel_id = hostel_id;
    }

    if (building_id && building_id !== "") {
        query.building_id = building_id;
    }
    if (room_no && room_no !== "") {
        query.room_no = room_no;
    }
    if (room_count && room_count !== "") {
        query.room_count = room_count;
    }

    if (status && status !== "") {
        query.status = status;
    }
    query.trash = 'NO';

    try {
        const buildings = await Rooms.find(query).
            populate("location_id", "location_name")
            .populate("hostel_id", "hostel_id")
            .populate("building_id", "building_name")
            .populate("created_by", "name");

        res.json({ success: true, data: buildings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }

}

const getRooms = async (req, res) => {
    try {
        const location_id = req.params.location_id;
        const hostel_id = req.params.hostel_id;
        const building_id = req.params.building_id;

        const rooms = await Rooms.find({
            location_id,
            hostel_id,
            building_id,
            trash: "NO"
        });

        res.status(200).json({
            message: "Data Fetched Successfully",
            data: rooms,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const AvailableSeats = async (req, res) => {
    try {
        const room_id = req.params.id;
        const seat_no = req.params.seat_no;

        const filter = {
            room_id,
            trash: "NO",
            status: "1"
        };

        if (!seat_no) {
            filter.seat_status = "1";
        }

        let rooms;

        if (seat_no) {
            rooms = await Roomstatus.find({
                $and: [
                    { room_id, trash: "NO", status: "1" },
                    {
                        $or: [
                            { seat_status: "1" },
                            { _id: seat_no }
                        ]
                    }
                ]
            });
        } else {
            rooms = await Roomstatus.find(filter);
        }
        
        res.status(200).json({
            message: "Data Fetched Successfully",
            data: rooms,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const importSubmit = async (req, res) => {
    try {
        const importedRows = req.importedData;
        if (!importedRows || importedRows.length === 0) {
            await Upload.create({
                file_name: req.file?.originalname || "Unknown File",
                errors_reason: JSON.stringify([{ error: "File is empty or contains no valid rows" }]),
                created_by: req.user?.id,
                status: 2,
            });

            return res.status(400).json({
                message: "Validation failed. File is empty or contains no rows.",
                errors: [{ error: "No data found in the file" }],
            });
        }

        const errorsArray = [];
        const validRows = [];

        for (let row = 0; row < importedRows.length; row++) {
            const currentRow = importedRows[row];
            const rowErrors = {};

            const locationName = currentRow.Location?.trim();
            let location_id;
            if (!locationName) {
                rowErrors.Location = "Location is empty";
            } else {
                const locationExist = await Location.findOne({ location_name: locationName });
                if (!locationExist) {
                    rowErrors.Location = "Location not found";
                } else {
                    location_id = locationExist._id;
                }
            }

            const hostelName = currentRow.Hostel?.trim();
            let hostel_id;
            if (!hostelName) {
                rowErrors.Hostel = "Hostel is empty";
            } else if (location_id) {
                const hostelExist = await Hostel.findOne({ hostel_name: hostelName, location_id });
                if (!hostelExist) {
                    rowErrors.Hostel = "Hostel not found for this location";
                } else {
                    hostel_id = hostelExist._id;
                }
            }

            const buildingName = currentRow.Building?.trim();
            let building_id;
            if (!buildingName) {
                rowErrors.Building = "Building is empty";
            } else if (location_id && hostel_id) {
                const buildingExist = await Building.findOne({
                    building_name: buildingName,
                    location_id,
                    hostel_id
                });
                if (!buildingExist) {
                    rowErrors.Building = "Building not found for this hostel/location";
                } else {
                    building_id = buildingExist._id;
                }
            }

            const roomNumber = currentRow['Room Number']?.trim();
            if (!roomNumber) {
                rowErrors['Room Number'] = "Room Number is empty";
            } else if (building_id) {
                const roomExist = await Rooms.findOne({
                    room_no: roomNumber,
                    location_id,
                    hostel_id,
                    building_id
                });
                if (roomExist) {
                    rowErrors['Room Number'] = "Room already exists in this building";
                }
            }

            const peopleCount = Number(currentRow['People Count'] || 0);

            if (Object.keys(rowErrors).length > 0) {
                errorsArray.push({
                    row: row + 2,
                    errors: rowErrors
                });
            } else {
                validRows.push({
                    location_id,
                    hostel_id,
                    building_id,
                    room_no: roomNumber,
                    room_count: peopleCount,
                    created_by: req.user.id,
                });
            }
        }

        if (errorsArray.length > 0) {
            await Upload.create({
                file_name: req.file?.originalname || "Unknown File",
                errors_reason: JSON.stringify(errorsArray, null, 2),
                created_by: req.user.id,
                status: 2,
            });

            return res.status(400).json({
                message: "Validation failed. Some rows have errors.",
                errors: errorsArray,
            });
        }

        await Rooms.insertMany(validRows);

        await Upload.create({
            file_name: req.file?.originalname || "Unknown File",
            errors_reason: null,
            created_by: req.user.id,
            status: 3,
        });

        return res.status(200).json({
            message: `Upload successfully`,
        });

    } catch (err) {
        console.error(err);
        await Upload.create({
            file_name: req.file?.originalname || "Unknown File",
            errors_reason: JSON.stringify([{ error: err.message }]),
            created_by: req.user?.id,
            status: 1,
        });

        return res.status(500).json({ message: "Server error while importing" });
    }
};

module.exports = {
    list,
    store,
    uniqueCheck,
    statusChange,
    deleteHostel,
    selectOne,
    updates,
    searchValues,
    getRooms,
    importSubmit,
    AvailableSeats
}