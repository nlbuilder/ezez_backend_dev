import { Request, Response } from "express";
import "dotenv/config";

import { staffWorkManagementDB } from "../mongodb/mongodbClient";

// def a reference to the daily_staff_work_timesheet collection
const dailyStaffWorkTimesheet = staffWorkManagementDB.collection(
    "daily_staff_work_timesheet"
);

// def a function to get daily work timesheet for a staff
// const getDailyStaffWorkTimesheetForBusiness = async (
//     req: Request,
//     res: Response
// ) => {
//     try {
//         const businessId = req.headers["business-id"];
//         const businessStaffId = req.headers["business-staff-id"];
//         const date = req.headers["date"];

//         // validate headers
//         if (!businessId || !businessStaffId || !date) {
//             console.log("businessId, businessStaffId and date are required");

//             return res.status(400).json({ message: "There is sort of error" });
//         }

//         // convert date to a Date object
//         const dateObj = new Date(date);
//         if (isNaN(dateObj.getTime())) {
//             return res.status(400).json({ message: "Invalid date format" });
//         }

//         // check if the dailyWorkTimesheet exists
//         const dailyWorkTimesheet = await dailyStaffWorkTimesheet.findOne({
//             businessId,
//             businessStaffId,
//             date: dateObj,
//         });

//         // check if the dailyWorkTimesheet exists
//         if (!dailyWorkTimesheet) {
//             console.log("Daily work timesheet not found for the given staff");

//             return res.status(404).json({
//                 message: "daily work timesheet not found",
//             });
//         }

//         res.status(200).json(dailyWorkTimesheet);
//     } catch (error) {
//         console.log("Error in getDailyStaffWorkTimesheet: ", error); // log the error for debugging purposes
//         res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
//     }
// };

// def a function to get daily work timesheets for all staff working for a given business
const getDailyAllWorkTimesheetsForBusiness = async (
    req: Request,
    res: Response
) => {
    try {
        const businessId = req.headers["business-id"];
        const date = req.headers["date"];

        // validate headers
        if (!businessId || !date) {
            console.log("businessId and date are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // convert date to a Date object
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        // check if the dailyWorkTimesheets exist for the given businessId
        const dailyWorkTimesheets = await dailyStaffWorkTimesheet
            .find({
                businessId,
                date: dateObj,
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

        if (!dailyWorkTimesheets) {
            console.log(
                "Daily work timesheets not found for the given business"
            );

            return res.status(404).json({
                message: "daily work timesheets not found",
            });
        }

        res.status(200).json(dailyWorkTimesheets);
    } catch (error) {
        console.log("Error in getDailyWorkTimesheetsForBusiness: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to get weekly work timesheet for all staff working for a given business
const getWeeklyAllWorkTimesheetForBusiness = async (
    req: Request,
    res: Response
) => {
    try {
        const businessId = req.headers["business-id"];
        const weekStart = req.headers["week-start"];

        // validate headers
        if (!businessId || !weekStart) {
            console.log("businessId and weekStart are required");

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
const updateDailyStaffWorkTimesheetForBusiness = async (
    req: Request,
    res: Response
) => {
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
            return res.status(400).json({ message: "Invalid date format" });
        }

        // check if the businessStaffId exists
        const dailyWorkTimesheet = await dailyStaffWorkTimesheet.findOne({
            businessId,
            businessStaffId,
            date: dateObj,
        });

        if (!dailyWorkTimesheet) {
            console.log("Daily work timesheet not found");

            return res.status(404).json({ message: "There is sort of error" });
        }

        // update the daily work timesheet for a given staff and date using findOneAndUpdate
        const updateResult = await dailyStaffWorkTimesheet.findOneAndUpdate(
            { businessId, businessStaffId, date },
            {
                $set: {
                    ...req.body,
                },
            },
            { returnDocument: "after" }
        );

        // check the updateResult
        if (!updateResult) {
            console.log(
                "can't execute dailyStaffWorkTimesheet.updateOne() successfully"
            );

            return res.status(404).json({ message: "There is sort of error" });
        }

        res.status(200).json({
            message: "Daily work timesheet updated successfully",
        });
    } catch (error) {
        console.log("Error in updateDailyStaffWorkTimesheet: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to delete daily work timesheet for a given staff and date
const deleteDailyStaffWorkTimesheetForBusiness = async (
    req: Request,
    res: Response
) => {
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
    // getDailyStaffWorkTimesheetForBusiness,
    getDailyAllWorkTimesheetsForBusiness,
    getWeeklyAllWorkTimesheetForBusiness,
    updateDailyStaffWorkTimesheetForBusiness,
    deleteDailyStaffWorkTimesheetForBusiness,
};
