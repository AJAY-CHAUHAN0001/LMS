import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './database/db.js';
import userRoute from './routes/user.route.js';
import courseRoute from './routes/course.route.js';
import mediaRoute from './routes/media.route.js';
import purchaseRoute from './routes/purchaseCourse.route.js';
import courseProgressRoute from './routes/courseProgress.route.js'
import path from 'path';

dotenv.config({});

const app = express();
const PORT = process.env.PORT || 5000;

const DIRNAME = path.resolve();

// app.use(express.json());


// Stripe webhook needs raw body, handle before express.json()
app.use((req, res, next) => {
    if (req.originalUrl === "/api/v1/purchase/webhook") {
      express.raw({ type: "application/json" })(req, res, next); // for Stripe
    } else {
      express.json()(req, res, next); // normal JSON parsing
    }
  });

app.use(cookieParser());
app.use(cors({
    origin: "https://lms-xwnv.onrender.com",
    credentials: true
}))

app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

app.use(express.static(path.join(DIRNAME, "/client/dist")));
app.get("*", (_, res) => {
    res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
});


app.listen(PORT, () => {
    console.log(`Server listen at PORT http://localhost:${PORT}`);
    connectDB();
})