const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Campus Club Member Schema
const memberSchema = new mongoose.Schema({
    registerNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    clubName: { type: String, required: true }
});

const Member = mongoose.model("CampusClubMember", memberSchema);

// Home route
app.get("/", (req, res) => {
    res.send("Campus Club Members Application is Running");
});

// Add a member
app.post("/members", async (req, res) => {
    try {
        const member = new Member(req.body);
        await member.save();
        res.status(201).json({
            message: "Member added successfully",
            data: member
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// View all members
app.get("/members", async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search by register number
app.get("/members/:registerNumber", async (req, res) => {
    try {
        const member = await Member.findOne({
            registerNumber: req.params.registerNumber
        });

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a member
app.put("/members/:registerNumber", async (req, res) => {
    try {
        const member = await Member.findOneAndUpdate(
            { registerNumber: req.params.registerNumber },
            req.body,
            { new: true, runValidators: true }
        );

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.json({
            message: "Member updated successfully",
            data: member
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a member
app.delete("/members/:registerNumber", async (req, res) => {
    try {
        const member = await Member.findOneAndDelete({
            registerNumber: req.params.registerNumber
        });

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.json({
            message: "Member deleted successfully",
            data: member
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server after MongoDB connects
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error("MongoDB Connection Error:", error.message);
    });