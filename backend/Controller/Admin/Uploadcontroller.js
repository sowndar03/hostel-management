const express = require('express');
const Upload = require('../../Model/Administration/Upload');

const list = async (req, res) => {
    try {
        const result = await Upload.find().populate("created_by", "name");;
        return res.status(200).json({ message: "Data fetched Successfully", data: result });
    } catch (err) {
        res.status(500).json("Something went wrong");
    }
}
const view = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Upload.findById(id)
            .select("file_name errors_reason createdAt") 
            .populate("created_by", "name"); 

        if (!result) {
            return res.status(404).json({ message: "Upload not found" });
        }

        return res
            .status(200)
            .json({ message: "Data fetched successfully", data: result });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


module.exports = {
    list,
    view
}