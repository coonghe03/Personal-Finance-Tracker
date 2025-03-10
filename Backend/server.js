import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import userRoutes from "./routes/userRoutes.js"; 
import swaggerDocs from "./config/swagger.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js"; 
import reportRoutes from "./routes/reportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import systemSettingRoutes from "./routes/systemSettingRoutes.js";



const app = express();
const port = process.env.PORT || 4000;
connectDB();
swaggerDocs(app);

app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes); 
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin/",adminRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/systems", systemSettingRoutes);
 
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
