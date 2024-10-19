import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// for business logic backend
import authBusinessRoute from "./auth/routes/authBusinessRoute";
import authBusinessStaffForBusinessRoute from "./auth/routes/authBusinessStaffForBusinessRoute";
import authBusinessStaffRoute from "./auth/routes/authBusinessStaffRoute";
import appointmentRoute from "./appointment/routes/appointmentRoute";
import serviceRoute from "./businessService/routes/serviceRoute";
import staffWorkTimesheetRoute from "./staffWork/routes/staffWorkTimesheetRoute";
import businessWorkTimesheetRoute from "./staffWork/routes/businessWorkTimesheetRoute";
import loyaltyRoute from "./loyalty/routes/loyaltyRoute";
import businessHourRoute from "./businessHours/routes/businessHoursRoute";

// for data analytics backend
import appointmentAnalyticsRoute from "./analytics/appointment/route/appointmentAnalyticRoute";
import staffWorkTimesheetAnalyticsRoute from "./analytics/staffWorkTimesheet/route/staffWorkTimesheetAnalyticRoute";

// define local port
const PORT = 8000;
// define frontend url for local development
const FRONTEND_URL_DEV = process.env.FRONTEND_URL_DEV as string;
// define frontend url for production
const FRONTEND_URL_PRO = process.env.FRONTEND_URL_PRO as string;

// define the MongoDB connection URL
const MONGODB_CONNECTION_STRING =
    process.env.MONGODB_CONNECTION_URL || "mongodb://localhost:27017";

// connect to MongoDB
mongoose.connect(MONGODB_CONNECTION_STRING);

// check if MongoDB is connected
export const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
    console.log("Connected to MongoDB");
});

// Create a new express application instance
const app = express();

// add the origin and credentials options here to enable CORS
app.use(
    cors({
        origin: [FRONTEND_URL_PRO, FRONTEND_URL_DEV],
        credentials: true,
    })
);

// tell express to use the json parser (i.e., application/json content type)
app.use(express.json());
// tell express to use the url encoded parser (i.e., application/x-www-form-urlencoded content type)
app.use(express.urlencoded({ extended: true }));
// tell the app to use the cookie parser
app.use(cookieParser());

// make a test endpoint
app.get("/healthcheck", async (req: Request, res: Response) => {
    res.json({ message: "Health check passed" });
});

// for business logic backend
app.use("/auth/business", authBusinessRoute);
app.use("/auth/staff/forBusiness", authBusinessStaffForBusinessRoute);
app.use("/auth/staff/forStaff", authBusinessStaffRoute);
app.use("/appointment", appointmentRoute);
app.use("/service", serviceRoute);
app.use("/timesheet", staffWorkTimesheetRoute);
app.use("/timesheet", businessWorkTimesheetRoute);
app.use("/loyalty", loyaltyRoute);
app.use("/businessHour", businessHourRoute);

// for data analytics backend
app.use("/analytics/appointment", appointmentAnalyticsRoute);
app.use("/analytics/staff-work-timesheet", staffWorkTimesheetAnalyticsRoute);

// start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
