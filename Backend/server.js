import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import userRoutes from "./routes/userRoutes.js"; // Changed to import

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes); // Changed router to userRoutes

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
