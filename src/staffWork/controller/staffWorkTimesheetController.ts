import { Request, Response } from "express";
import "dotenv/config";

import { staffWorkManagementDB } from "../mongodb/mongodbClient";
import {
    computeTotalHours,
    getCurrentDate,
    getCurrentWeekStart,
} from "./utils";

// def a reference to the daily_staff_work_timesheet collection
const dailyStaffWorkTimesheet = staffWorkManagementDB.collection(
    "daily_staff_work_timesheet"
);

// def a function to create a new daily work timesheet for a staff
const createDailyStaffWorkTimesheet = async (req: Request, res: Response) => {
    try {
        const { businessId, businessStaffId, checkIn, checkOut, totalHours } =
            await req.body;

        // validate the request body
        if (
            !businessId ||
            !businessStaffId ||
            !checkIn ||
            !checkOut ||
            !totalHours
        ) {
            console.log("Missing required fields");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // initialize the weekStart and date
        const weekStart = getCurrentWeekStart();
        const date = getCurrentDate();
        const totalHoursOfWork = computeTotalHours(checkIn, checkOut);
        const managerApproval = true;

        // check if the businessStaffId exists else create a dailyStaffWorkTimesheet
        const dailyWorkTimesheet =
            await dailyStaffWorkTimesheet.findOneAndUpdate(
                { businessId, businessStaffId, date },
                {
                    $setOnInsert: {
                        businessId,
                        businessStaffId,
                        weekStart,
                        date,
                        checkIn,
                        checkOut,
                        totalHours: totalHoursOfWork,
                        managerApproval,
                    },
                },
                { upsert: true, returnDocument: "after" }
            );

        // check the execution of the findOneAndUpdate
        if (!dailyWorkTimesheet) {
            console.log(
                "can't execute dailyStaffWorkTimesheet.findOneAndUpdate() successfully"
            );

            return res.status(200).send({ message: "There is sort of error" });
        }

        res.status(201).json({
            message: "Daily work timesheet created successfully",
        });
    } catch (error) {
        console.log("Error in createDailyStaffWorkTimesheet: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to get daily work timesheet for a staff
const getDailyStaffWorkTimesheet = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"];
        const businessStaffId = req.headers["business-staff-id"];
        const date = req.headers["date"];

        // validate headers
        if (!businessId || !businessStaffId || !date) {
            console.log("businessId, businessStaffId and date are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // convert date to a Date object
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            console.log("Invalid date format");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the dailyWorkTimesheet exists
        const dailyWorkTimesheet = await dailyStaffWorkTimesheet.findOne({
            businessId,
            businessStaffId,
            date: dateObj,
        });

        if (!dailyWorkTimesheet) {
            console.log("Daily work timesheet not found");

            return res
                .status(404)
                .json({ message: "daily work timesheet not found" });
        }

        res.status(200).json(dailyWorkTimesheet);
    } catch (error) {
        console.log("Error in getDailyStaffWorkTimesheet: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to get weekly work timesheet for a staff
const getWeeklyStaffWorkTimesheetForStaff = async (
    req: Request,
    res: Response
) => {
    try {
        const businessId = req.headers["business-id"];
        const businessStaffId = req.headers["business-staff-id"];
        const weekStart = req.headers["week-start"];

        // validate headers
        if (!businessId || !businessStaffId || !weekStart) {
            console.log(
                "businessId, businessStaffId and weekStart are required"
            );

            return res.status(400).json({ message: "There is sort of error" });
        }

        // convert weekStart to a Date object
        const weekStartString = Array.isArray(weekStart)
            ? weekStart[0]
            : weekStart;
        const weekStartDate = new Date(weekStartString);
        if (isNaN(weekStartDate.getTime())) {
            console.log("Invalid weekStart date");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // retrieve the weekly work timesheet for the specified businessStaffId
        const weeklyWorkTimesheet = await dailyStaffWorkTimesheet
            .find({
                businessId,
                businessStaffId,
                weekStart: weekStartDate,
            })
            .toArray(); // convert the cursor to an array
        // I need to use the toArray method here because
        // I applied the native MongdoDB driver with MongoClient
        // to connect to the MongoDB database, so that
        // I directly work with  a Collection<DOCUMENT> object
        // instead of a Mongoose Model object.

        // The toArray method returns a promise making it an async operation
        // (i.e., it returns a Promise<DOCUMENT[]>) to use async/await here
        // if not using the toArray method,
        // the find method returns a Cursor<DOCUMENT> object
        // which is not a promise, so I can't use async/await here.

        // key point: - MongoDB Model returns a promise-based object
        //            - MongoDB Collection returns a cursor-based object

        if (!weeklyWorkTimesheet) {
            console.log("weekly work timesheet not found");

            return res
                .status(404)
                .json({ message: "weekly work timesheet not found" });
        }

        res.status(200).json(weeklyWorkTimesheet);
    } catch (error) {
        console.log("Error in getWeeklyStaffWorkTimesheet: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to update daily work timesheet for a staff
const updateDailyStaffWorkTimesheet = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"];
        const businessStaffId = req.headers["business-staff-id"];
        const date = req.headers["date"];

        // validate headers
        if (!businessId || !businessStaffId || !date) {
            console.log("businessId, businessStaffId and date are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // convert date to a Date object
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            console.log("Invalid date format");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check the existence of the daily work timesheet for the given businessId, businessStaffId, and date
        // and update using findOneAndUpdate
        const updateDailyWorkTimesheet =
            await dailyStaffWorkTimesheet.findOneAndUpdate(
                { businessId, businessStaffId, date: dateObj },
                {
                    $set: {
                        ...req.body,
                    },
                },
                { returnDocument: "after" }
            );

        // check the updateDailyWorkTimesheet
        if (!updateDailyWorkTimesheet) {
            console.log("Failed to update the daily work timesheet");

            return res.status(404).json({ message: "There is sort of error" });
        }
    } catch (error) {
        console.log("Error in updateDailyStaffWorkTimesheet: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to delete daily work timesheet for a staff
const deleteDailyStaffWorkTimesheet = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"];
        const businessStaffId = req.headers["business-staff-id"];
        const date = req.headers["date"];

        // validate headers
        if (!businessId || !businessStaffId || !date) {
            console.log("Missing required headers");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // convert date to a Date object
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        // find and delete the daily work timesheet
        const deleteResult = await dailyStaffWorkTimesheet.findOneAndDelete({
            businessId,
            businessStaffId,
            date: dateObj,
        });

        // check the deleteResult
        if (!deleteResult) {
            console.log("Failed to delete the timesheet");

            return res.status(404).json({ message: "There is sort of error" });
        }

        res.status(200).json({
            message: "Daily work timesheet deleted successfully",
        });
    } catch (error) {
        console.log("Error in deleteDailyStaffWorkTimesheet: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

export default {
    createDailyStaffWorkTimesheet,
    getDailyStaffWorkTimesheet,
    getWeeklyStaffWorkTimesheetForStaff,
    updateDailyStaffWorkTimesheet,
    deleteDailyStaffWorkTimesheet,
};
