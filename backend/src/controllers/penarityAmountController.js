import db from "../database/models/index.js";
const { PenarityAmounts, Users, Notifications } = db;

// Helper function to send notifications
const sendNotification = async (userID, title, message, type) => {
  try {
    await Notifications.create({ userID, title, message, type });
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

// Get Penarity Amount
export const getPenarityAmount = async (req, res) => {
  try {
    const PenarityAmount = await PenarityAmounts.findAll();
    if (!PenarityAmount) {
      return res.status(404).json({ message: "Penarity amount not found." });
    }
    return res.status(200).json(PenarityAmount);
  } catch (error) {
    console.error("Error fetching penarity amount:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Update Penarity Amount and Notify Users
// Update Penalty Amount and Notify Users
export const updatePenarityAmount = async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ message: "Amount is required." });
  }

  try {
    let PenarityAmount = await PenarityAmounts.findOne({
      where: { id: 1 },
    });

    if (!PenarityAmount) {
      PenarityAmount = await PenarityAmounts.create({ amount });
    } else {
      await PenarityAmounts.update({ amount }, { where: { id: 1 } }); // Fixed the missing `where` clause
    }

    // Fetch all system users
    const users = await Users.findAll({ attributes: ["id"] });

    // Send notification to all users
    for (const user of users) {
      await sendNotification(
        user.id,
        "Penalty Amount Updated",
        `The penalty amount has been updated to ${amount}. Please take note.`,
        "penalty"
      );
    }

    return res.status(200).json({
      message: "Penalty amount updated successfully and users notified",
      PenarityAmounts,
    });
  } catch (error) {
    console.error("Error updating penalty amount:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

