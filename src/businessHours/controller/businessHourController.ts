import { Request, Response } from "express";
import "dotenv/config";

import { businessDB } from "../mongodb/mongodbClient";

// def a reference to the appointment_info collection
const businessHourInfo = businessDB.collection("business_hour_info");

// def a func to create new business hours
const createBusinessHour = async (req: Request, res: Response) => {
    try {
        const { businessId, startTime, finishTime } = await req.body;

        console.log("businessId: ", businessId);
        console.log("startTime: ", startTime);
        console.log("finishTime: ", finishTime);

        // validate the request body
        if (!businessId || !startTime || !finishTime) {
            console.log("Missing required fields");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the businessHour already exists else create a new one using findOneAndUpdate
        const businessHour = await businessHourInfo.findOneAndUpdate(
            { businessId },
            {
                $setOnInsert: {
                    businessId,
                    startTime,
                    finishTime,
                },
            },
            { upsert: true, returnDocument: "after" }
        );

        // check the existance of the service after executing the findOneAndUpdate
        if (!businessHour) {
            console.log(
                "Error when executing findOneAndUpdate() for createBusinessHour() "
            );

            return res.status(200).send({ message: "There is sort of error" });
        }

        return res.status(201).send({ message: "businessHour created" });
    } catch (error) {
        console.log("Error in createBusinessHours: ", error); // log the error for debugging purposes

        res.status(500).json({ message: "There is sort of error" });
    }
};

// def a function to get businessHour for the given businessId
const getBusinessHourInfo = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"];

        // validate headers
        if (!businessId) {
            console.log("businessId is required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the services exist for the given businessId
        const businessHour = await businessHourInfo
            .find({ businessId })
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

        // check the existance of the services
        if (!businessHour || businessHour.length === 0) {
            console.log("no businessHour found for the given businessId");

            return res.status(404).json({ message: "There is sort of error" });
        }

        res.status(200).json(businessHour);
    } catch (error) {
        console.log("Error in getBusinessHourInfo: ", error); // log the error for debugging purposes

        res.status(500).json({ message: "There is sort of error" });
    }
};

// def a function to update businessHourInfo for the given businessId
const updateBusinessHourInfo = async (req: Request, res: Response) => {
    try {
        const { businessId, startTime, finishTime } = await req.body;

        // validate the request body
        if (!businessId || !startTime || !finishTime) {
            console.log("Missing required fields");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the businessHour exists for the given businessId
        const updateBusinessHour = await businessHourInfo.findOneAndUpdate(
            { businessId },
            {
                $set: {
                    startTime,
                    finishTime,
                },
            },
            { returnDocument: "after" }
        );

        // check if the businessHour was updated successfully
        if (!updateBusinessHour) {
            console.log(
                "Error when executing findOneAndUpdate() for service update"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        res.status(200).json(updateBusinessHour);
    } catch (error) {
        console.log("Error in updateBusinessHour(): ", error); // log the error for debugging purposes

        res.status(500).json({ message: "There is sort of error" });
    }
};

export default {
    createBusinessHour,
    getBusinessHourInfo,
    updateBusinessHourInfo,
};
