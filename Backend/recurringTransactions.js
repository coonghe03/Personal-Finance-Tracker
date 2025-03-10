const cron = require("node-cron");
const Transaction = require("./models/transactionModel"); 
const User = require("./models/userModel");
const sendNotification = require("./utils/notification");

cron.schedule("0 0 * * *", async () => {
    console.log("Checking for upcoming or missed transactions...");
    
    const today = new Date();
    const transactions = await Transaction.find({ recurring: true, nextOccurrenceDate: { $lte: today } });

    for (const transaction of transactions) {
        const user = await User.findById(transaction.userId);

        if (user) {
            // Send notification for the missed or upcoming transaction
            await sendNotification(user.email, `Reminder: Your ${transaction.type} transaction for ${transaction.category} is due.`);
        }

        // Update next occurrence date based on the recurrence pattern
        let nextDate = new Date(transaction.nextOccurrenceDate);
        switch (transaction.recurrencePattern) {
            case "daily":
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case "weekly":
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case "monthly":
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
        }

        // Update transaction with new next occurrence date
        await Transaction.findByIdAndUpdate(transaction._id, { nextOccurrenceDate: nextDate });
    }

    console.log("Recurring transaction check completed.");
});
