import db from "../database/models/index.js";
const { Attendances,Penalties ,Users,Posts,Notifications} = db;
import { Op } from "sequelize";



// Helper function to send notifications
const sendNotification = async (userID, title, message, type) => {
  try {
    await Notifications.create({ userID, title, message, type });
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

// Create attendance record and notify user
export const markAttendance = async (req, res) => {
  try {
    const { userID, postID, attended } = req.body;

    if (!userID || !postID) {
      return res.status(400).json({ message: "UserID and PostID are required." });
    }

    // Step 1: Check if attendance already exists
    const existingAttendance = await Attendances.findOne({
      where: { userID, postID },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance for this post has already been recorded." });
    }

    // Step 2: Record attendance if no previous record exists
    const attendance = await Attendances.create({ userID, postID, attended });

    const message = attended
      ? "Your attendance has been marked successfully."
      : "Your attendance record has been updated.";
      
    await sendNotification(userID, "Attendance Update", message, "attendance");

    res.status(201).json({ message: "Attendance recorded successfully.", attendance });
  } catch (error) {
    res.status(500).json({ message: "Error saving attendance.", error: error.message });
  }
};


// Get all attendances with user and post details
export const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendances.findAll({
      include: [
        { model: Users, as: "user", attributes: ["id", "firstname", "lastname", "email", "phone"] },
        { model: Posts, as: "post"},
      ],
    });

    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendances", error: error.message });
  }
};

// Get attendance by ID
export const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendances.findByPk(id, {
      include: [
        { model: Users, as: "user", attributes: ["id", "firstname", "lastname", "email", "phone"] },
        { model: Posts, as: "post" },
      ],
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error: error.message });
  }
};

// Update attendance
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { attended } = req.body;

    const attendance = await Attendances.findByPk(id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    await attendance.update({ attended });

    const message = attended
      ? "Your attendance status has been updated to Present."
      : "Your attendance status has been updated to Absent.";
    await sendNotification(attendance.userID, "Attendance Update", message, "attendance");

    res.status(200).json({ message: "Attendance updated successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: "Error updating attendance", error: error.message });
  }
};

// Delete attendance
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendances.findByPk(id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    await attendance.destroy();

    await sendNotification(attendance.userID, "Attendance Removed", "Your attendance record has been deleted.", "attendance");

    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting attendance", error: error.message });
  }
};


export const getCitizenPosts = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "citizen") {
      return res.status(403).json({ message: "Access denied. Only citizens can access this resource." });
    }

    const userID = req.user.id;
    const village_id = req.user.village_id;

    // Fetch posts that belong to the citizen's village and are approved
    const posts = await Posts.findAll({
      where: {
        [Op.and]: [
          { village_id: village_id }, 
          { status: "approved" }
        ],
      },
      include: [
        {
          model: Attendances,
          as: "attendances",
          attributes: ["id", "attended", "createdAt"],
          where: { userID: userID }, // Only fetch attendance for the logged-in user
          required: false, // Allow posts without attendance records
        },
        {
          model: Penalties,
          as: "penalties",
          attributes: ["id", "penarity", "status"],
          where: { userID: userID }, // Only fetch penalties for the logged-in user
          required: false, // Allow posts without penalties
        },
      ],
    });

    if (!posts.length) {
      return res.status(404).json({ success: false, message: "No posts found for your village." });
    }

    return res.status(200).json({
      success: true,
      message: "Posts retrieved successfully for citizens.",
      data: posts,
    });

  } catch (error) {
    console.error("❌ Error fetching citizen posts:", error);
    return res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};

