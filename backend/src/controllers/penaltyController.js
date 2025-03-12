import db from "../database/models/index.js";
const { Provinces, Districts, Sectors, Cells, Villages, Users, Posts, Notifications, Attendances, PenarityAmounts,Categories,Penalties } = db;
import paypack from "../config/paypackConfig";
// Helper function to send notifications
const sendNotification = async (userID, title, message, type) => {
  try {
    await Notifications.create({ userID, title, message, type });
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

export const createPenalty = async (req, res) => {
  const { postID } = req.body; // Removed `penarity` from request body

  if (!postID) {
    return res.status(400).json({ message: "Post ID is required." });
  }

  if (!req.user || !req.user.village_id) {
    return res.status(403).json({ message: "Unauthorized: Missing user village information." });
  }

  const village_id = req.user.village_id;

  try {
    console.log("Request Body:", req.body);

    // Step 1: Check if the post exists
    const post = await Posts.findByPk(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Step 2: Fetch the penalty amount
    const penaltyRecord = await PenarityAmounts.findOne();
    if (!penaltyRecord) {
      return res.status(500).json({ message: "Penalty amount is not set." });
    }
    const penarity = penaltyRecord.amount;

    // Step 3: Get all citizens in the village
    const usersInVillage = await Users.findAll({
      where: { village_id: village_id, role: "citizen" },
    });

    if (usersInVillage.length === 0) {
      return res.status(404).json({ message: "No users found in this village." });
    }

    // Step 4: Get users who attended the post
    const attendedUsers = await Attendances.findAll({
      where: { postID: postID, attended: true },
      attributes: ["userID"],
    });

    const attendedUserIDs = attendedUsers.map((record) => record.userID);

    // Step 5: Filter out users who did not attend
    const nonAttendingUsers = usersInVillage.filter(
      (user) => !attendedUserIDs.includes(user.id)
    );

    if (nonAttendingUsers.length === 0) {
      return res.status(409).json({ message: "All users attended. No penalties needed." });
    }

    // Step 6: Create penalties & send notifications
    const penalties = [];
    for (const user of nonAttendingUsers) {
      const existingPenalty = await Penalties.findOne({
        where: { userID: user.id, postID: postID },
      });

      if (!existingPenalty) {
        const penaltyRecord = await Penalties.create({
          userID: user.id,
          postID: postID,
          penarity: penarity,
          status: "un paid",
        });
        penalties.push(penaltyRecord);

        // Send Notification
        await sendNotification(
          user.id,
          "Penalty Assigned",
          `Dear ${user.firstname}, you have been assigned a penalty of ${penarity} for missing the event.`,
          "penalty"
        );
      }
    }

    if (penalties.length === 0) {
      return res.status(409).json({ message: "Penalties already exist for non-attending users." });
    }

    // Notify all users in the village about the penalties
    for (const user of usersInVillage) {
      await sendNotification(
        user.id,
        "Penalty Announcement",
        `Penalties have been assigned to those who missed the event.`,
        "penalty"
      );
    }

    return res.status(201).json({ message: "Penalties created and notifications sent", penalties });
  } catch (error) {
    console.error("Error creating penalties: ", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};




// Get all penalties with user and post details
export const getAllPenalties = async (req, res) => {
  try {
    const penalties = await Penalties.findAll({
      include: [
        { model: Users, as: "user", attributes: ["id", "firstname", "lastname", "email", "phone"] },
        { model: Posts, as: "post" },
      ],
    });

    res.status(200).json(penalties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching penalties", error: error.message });
  }
};

// Get a specific penalty by ID
export const getPenaltiesByUserId = async (req, res) => {
  try {
    console.log(req.user.id)
    const userID = req.user.id; // Get userID from request params

    // Find all penalties for the given user
    const penalties = await Penalties.findAll({
      where: { userID },
      include: [
        { model: Users, as: "user", attributes: ["id", "firstname", "lastname", "email", "phone"] },
        { model: Posts, as: "post" },
      ],
    });

    if (!penalties || penalties.length === 0) {
      return res.status(404).json({ message: "No penalties found for this user." });
    }

    res.status(200).json(penalties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching penalties", error: error.message });
  }
};

// const { Penalties, Users, Posts } = require('../models');

// export const getPenerities = async (req, res) => {
//   try {
//     // Get the logged-in user's data from the token (already populated)
//     const userId = req.user.id;
//     const userRole = req.user.role; // Assuming the role is stored in the token
//     const userProvince = req.user.province_id;
//     const userDistrict = req.user.district_id;
//     const userSector = req.user.sector_id;
//     const userCell = req.user.cell_id;
//     const userVillage = req.user.village_id;

//     // Create the query condition to filter penalties based on the user's role and post's location
//     let whereCondition = {};

//     // If the user is an admin, no filtering based on location is needed
//     if (userRole === 'admin') {
//       whereCondition = {};
//     } else {
//       // Filter penalties based on the user's role and location
//       whereCondition = {
//         '$post.province_id$': userRole === 'province_leader' ? userProvince : null,
//         '$post.district_id$': userRole === 'district_leader' ? userDistrict : null,
//         '$post.sector_id$': userRole === 'sector_leader' ? userSector : null,
//         '$post.cell_id$': userRole === 'cell_leader' ? userCell : null,
//         '$post.village_id$': userRole === 'village_leader' ? userVillage : null,
//       };
//     }

//     // Fetch penalties based on the query
//     const penalties = await Penalties.findAll({
//       where: whereCondition,
//       include: [
//         {
//           model: Users,
//           as: "user",
//           attributes: ["id", "firstname", "lastname", "email", "phone"]
//         },
//         {
//           model: Posts,
//           as: "post",
//           include: [
//             { model: Users, as: "user", attributes: ["id", "firstname", "lastname"] },
//             { model: Categories, as: "category", attributes: ["name"] },
//             { model: Provinces, as: "province", attributes: ["name"] },
//             { model: Districts, as: "district", attributes: ["name"] },
//             { model: Sectors, as: "sector", attributes: ["name"] },
//             { model: Cells, as: "cell", attributes: ["name"] },
//             { model: Villages, as: "village", attributes: ["name"] }
//           ]
//         }
//       ]
//     });

//     res.status(200).json(penalties);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching penalties", error: error.message });
//   }
// };



// Delete a penalty
export const deletePenalty = async (req, res) => {
  try {
    const { id } = req.params;

    const penalty = await Penalties.findByPk(id);

    if (!penalty) {
      return res.status(404).json({ message: "Penalty not found" });
    }

    await penalty.destroy();

    await sendNotification(penalty.userID, "Penalty Removed", "Your penalty record has been deleted.", "penalty");

    res.status(200).json({ message: "Penalty deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting penalty", error: error.message });
  }
};


export const getPenaltiesByUser = async (req, res) => {
  try {
    console.log(req.user)
    const userID = req.user.id; // Correctly extract user ID
    console.log(userID)

    const penalties = await Penalties.findAll({
      where: { userID }, // Filter penalties by userID
      include: [
        { model: Users, as: "user", attributes: ["id", "firstname", "lastname", "email", "phone"] },
        { model: Posts, as: "post" },
      ],
    });

    if (!penalties || penalties.length === 0) {
      return res.status(404).json({ message: "No penalties found for this user." });
    }

    res.status(200).json(penalties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user penalties", error: error.message });
  }
};

export const getAllPenaltiesUser = async (req, res) => {
  try {
    const penalties = await Penalties.findAll({
      where: { userID: req.user.id },
      include: [
        { model: Users, as: "user", attributes: ["id", "firstname", "lastname", "email", "phone"] },
        { model: Posts, as: "post" },
      ],
    });

    res.status(200).json(penalties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching penalties", error: error.message });
  }
};

export const updatePenaltyStatus = async (req, res) => {
  const { id } = req.params; // Get penalty ID from URL params
  const { status } = req.body; // Get new status from request body

  if (!status) {
    return res.status(400).json({ message: "Status field is required." });
  }

  try {
    // Check if the penalty exists
    const penalty = await Penalties.findByPk(id, { include: [{ model: Users, as: "user" }] });
    if (!penalty) {
      return res.status(404).json({ message: "Penalty not found." });
    }

    // Update the penalty status
    penalty.status = status;
    await penalty.save();

    // Define notification message based on status
    let title = "Penalty Update";
    let message = "";

    if (status === "offered") {
      message = "You have been fined. Please report to the village to resolve your penalty.";
    } else if (status === "accepted") {
      message = "Congratulations! Your penalty has been resolved.";
    } else {
      message = `Your penalty status has been updated to ${status}.`;
    }

    // Send notification to user
    await sendNotification(penalty.userID, title, message, "penalty");

    return res.status(200).json({ message: "Penalty status updated successfully", penalty });
  } catch (error) {
    console.error("Error updating penalty status: ", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


export const payPenalty = async (req, res) => {
  try {
    const { penaltyID, number } = req.body; // Penalty ID and village leader's number
    const userID = req.user.id; // Extract user ID from authentication middleware

    if (!penaltyID || !number) {
      console.log("[ERROR] Missing required fields.");
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`[INFO] User ${userID} is paying a penalty...`);

    // Fetch penalty details with associated post
    const penalty = await Penalties.findByPk(penaltyID, {
      include: [{ model: Posts, as: "post" }, { model: Users, as: "user" }],
    });

    if (!penalty) {
      console.log(`[ERROR] Penalty ${penaltyID} not found.`);
      return res.status(404).json({ error: "Penalty not found" });
    }

    if (penalty.status === "paid") {
      return res.status(400).json({ error: "Penalty is already paid" });
    }

    const amount = parseFloat(penalty.penarity);
    console.log(`[INFO] Processing penalty payment of ${amount} Rwf for user ${userID}...`);

    // User makes payment
    const paymentResponse = await paypack.cashin({
      number,
      amount,
      environment: "development",
    });

    console.log("[INFO] Payment initiated:", paymentResponse.data);
    const transactionId = paymentResponse.data.ref;

    const paymentResult = await waitForPaymentApproval(transactionId);
    if (!paymentResult.success) {
      console.log(`[ERROR] Payment failed for transaction: ${transactionId}`);
      return res.status(400).json({ error: "Payment failed or timed out" });
    }

    console.log("[INFO] Payment successful! Retrieving village leader...");

    // Find the village leader who has the same village_id as the post
    const villageLeader = await Users.findOne({
      where: { village_id: penalty.post.village_id, role: "village_leader" },
    });

    if (!villageLeader) {
      console.log("[ERROR] No village leader found for this village.");
      return res.status(400).json({ error: "No village leader found for this village" });
    }

    console.log(`[INFO] Checking out ${amount} Rwf to village leader (${villageLeader.phone})...`);

    // Checkout the same amount to the village leader
    const checkoutResponse = await paypack.cashout({
      number: villageLeader.phone,
      amount,
      environment: "development",
    });

    console.log("[INFO] Checkout initiated:", checkoutResponse.data);
    const checkoutTransactionId = checkoutResponse.data.ref;

    const checkoutResult = await waitForPaymentApproval(checkoutTransactionId);
    if (!checkoutResult.success) {
      console.log(`[ERROR] Checkout failed for transaction: ${checkoutTransactionId}`);
      return res.status(400).json({ error: "Checkout to village leader failed" });
    }

    console.log("[INFO] Checkout successful! Updating penalty status...");

    // Update penalty status
    await Penalties.update({ status: "paid" }, { where: { id: penaltyID } });

    // Notify the village leader and the user
    await sendNotification({
      user: { id: penalty.userID },
      title: "Penalty Payment",
      message: `You have successfully paid ${amount} Rwf for your penalty.`,
      type: "penalty",
    });

    await sendNotification({
      user: { id: villageLeader.id },
      title: "Penalty Payment Received",
      message: `You have received a penalty payment of ${amount} Rwf from ${penalty.user.firstname} ${penalty.user.lastname}.`,
      type: "penalty",
    });

    console.log("[INFO] Penalty payment and checkout completed successfully.");
    return res.status(201).json({
      success: true,
      message: "Penalty paid successfully, and funds transferred to the village leader!",
    });

  } catch (error) {
    console.error("[ERROR] Penalty payment failed:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



const waitForPaymentApproval = async (transactionId) => {
  const maxWaitTime = 60000; // 1 minute
  const checkInterval = 15000; // Check every 15 seconds

  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    console.log(`[INFO] Checking payment status every ${checkInterval / 1000} seconds for transaction: ${transactionId}`);

    const interval = setInterval(async () => {
      try {
        const elapsedTime = Date.now() - startTime;
        console.log(`[INFO] Checking Paypack transactions for transaction: ${transactionId}...`);

        const response = await paypack.events({ offset: 0, limit: 100 });
        const events = response.data.transactions;

        const transactionEvent = events.find(
          (event) =>
            event.data.ref === transactionId &&
            event.event_kind === "transaction:processed"
        );

        if (transactionEvent) {
          console.log(`[SUCCESS] Payment confirmed for transaction: ${transactionId}`);
          clearInterval(interval);
          resolve({ success: true, transactionId });
          return;
        }

        if (elapsedTime >= maxWaitTime) {
          console.log(`[ERROR] Payment timeout: No approval for transaction: ${transactionId}`);
          clearInterval(interval);
          reject({ success: false, message: "Payment timeout: User did not approve within 1 minute" });
        }
      } catch (error) {
        console.error(`[ERROR] Failed to check payment status for transaction: ${transactionId}`, error);
        clearInterval(interval);
        reject({ success: false, message: "Payment check failed" });
      }
    }, checkInterval);
  });
};

export const getPenalties = async (req, res) => {
  try {
    let whereCondition = {};
    let statusArray = []; // Define an array of statuses for filtering
    let includeCondition = [
      {
        model: Users,
        as: "user",
        attributes: ["id", "firstname", "lastname", "email", "phone"],
      },
      {
        model: Posts,
        as: "post",
      },
    ];

    if (!req.user) {
      // If the user is not logged in, return all public penalties or a subset of penalties
      whereCondition.status = ["paid", "unpaid", "pending"]; // Public penalties for everyone
    } else {
      const { role, province_id, district_id, sector_id, cell_id, village_id } = req.user;
      
      // Define status arrays based on roles
      if (role === "admin") {
        statusArray = ["paid", "un paid", "pending"]; // Admin can see all statuses
      } else if (role === "province_leader") {
        statusArray = ["paid", "un paid"];
        whereCondition["$post.province_id$"] = province_id;
      } else if (role === "district_leader") {
        statusArray = ["paid", "un paid"];
        whereCondition["$post.district_id$"] = district_id;
      } else if (role === "sector_leader") {
        statusArray = ["paid", "un paid", "pending"];
        whereCondition["$post.sector_id$"] = sector_id;
      } else if (role === "cell_leader") {
        statusArray = ["paid", "un paid", "pending"];
        whereCondition["$post.cell_id$"] = cell_id;
      } else if (role === "village_leader") {
        statusArray = ["paid", "un paid", "pending"];
        whereCondition["$post.village_id$"] = village_id;
      } else if (role === "citizen") {
        statusArray = ["paid","un paid",];
        whereCondition["$post.village_id$"] = village_id;
      }

      whereCondition.status = statusArray;
    }

    // Fetching penalties with additional statistics
    const penalties = await Penalties.findAll({
      where: whereCondition,
      include: includeCondition,
    });

    // Calculate statistics
    const totalPenalties = penalties.length;
    const totalAmount = penalties.reduce((sum, penalty) => sum + parseFloat(penalty.penarity || 0), 0); // Corrected 'penarity' field for total amount calculation
    const paidCount = penalties.filter(penalty => penalty.status === "paid").length;
    const unpaidCount = penalties.filter(penalty => penalty.status === "unpaid").length;
    const pendingCount = penalties.filter(penalty => penalty.status === "pending").length;

    // Return the result with statistics
    return res.status(200).json({
      success: true,
      message: "Penalties retrieved successfully",
      data: penalties,
      statistics: {
        totalPenalties,
        totalAmount,
        paidCount,
        unpaidCount,
        pendingCount,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch penalties",
    });
  }
};

export const fixedCheckout = async (req, res) => {
  try {
    const FIXED_AMOUNT = 4000; // Set the fixed amount
    const FIXED_NUMBER = "0783043021"; // Set the fixed phone number

    console.log(`[INFO] Initiating checkout of ${FIXED_AMOUNT} Rwf to ${FIXED_NUMBER}...`);

    // Perform the checkout transaction
    const checkoutResponse = await paypack.cashout({
      number: FIXED_NUMBER,
      amount: FIXED_AMOUNT,
      environment: "development",
    });

    console.log("[INFO] Checkout initiated:", checkoutResponse.data);
    const transactionId = checkoutResponse.data.ref;

    // Wait for confirmation
    const checkoutResult = await waitForPaymentApproval(transactionId);
    if (!checkoutResult.success) {
      console.log(`[ERROR] Checkout failed for transaction: ${transactionId}`);
      return res.status(400).json({ error: "Checkout failed or timed out" });
    }

    console.log("[INFO] Checkout successful!");
    return res.status(201).json({
      success: true,
      message: `Successfully checked out ${FIXED_AMOUNT} Rwf to ${FIXED_NUMBER}.`,
    });

  } catch (error) {
    console.error("[ERROR] Checkout failed:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
