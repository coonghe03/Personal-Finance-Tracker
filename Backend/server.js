import express from "express";
import cors from "cors";
import 'dotenv/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
import dashboardRoutes from "./routes/dashboardRoutes.js";


const app = express();
const port = process.env.PORT || 4000;
connectDB();
swaggerDocs(app);

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
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
app.use("/api/dashboard", dashboardRoutes);

 
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
