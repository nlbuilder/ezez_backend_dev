import { Request, Response } from "express";
import "dotenv/config";

import { client } from "../mongodb/mongodbClient";
import { businessDB } from "../mongodb/mongodbClient";

// def a reference to the business_info collection
const businessInfo = businessDB.collection("business_info");

// def a reference to the business_staff_info collection
const businessStaffInfo = businessDB.collection("business_staff_info");

// def a function to create a new business
const createBusinessInfo = async (req: Request, res: Response) => {
    try {
        const { businessId, name, email } = await req.body;

        // validate the request body
        if (!businessId || !name || !email) {
            console.log("businessId, name and email are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the business already exists else create a new one using findOneAndUpdate
        const business = await businessInfo.findOneAndUpdate(
            { businessId },
            { $setOnInsert: { businessId, name, email } },
            { upsert: true, returnDocument: "after" }
        );

        // check if the existance of the business after executing the findOneAndUpdate
        if (!business) {
            console.log(
                "can't execute the businessInfo.findOneAndUpdate successfully"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        // send a success message to the client
        res.status(201).json({ message: "Business created successfully" });
    } catch (error) {
        console.log("Error in createBusiness: ", error); // log the error for debugging purposes

        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to get business info
const getBusinessInfo = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"];

        // validate the request body
        if (!businessId) {
            console.log("businessId is missing");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the businessId exists
        const business = await businessInfo.findOne({ businessId });

        // check if the business exists
        if (!business) {
            console.log("Business not found");

            return res.status(404).json({ message: "business not found" });
        }

        res.status(200).json(business);
    } catch (error) {
        console.log("Error in getBusinessInfo: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to get all staff info working for a business
const getBusinessStaffInfoForBusiness = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"];

        // validate headers
        if (!businessId) {
            console.log("businessId is required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the businessId exists
        const staffs = await businessStaffInfo.find({ businessId }).toArray(); // convert the cursor to an array

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

        // check if the staff exists

        if (staffs.length === 0) {
            console.log("No staff found for the given businessId");

            return res.status(404).json({ message: "staff not found" });
        }

        res.status(200).json(staffs);
    } catch (error) {
        console.log("Error in getBusinessInfo: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" });
    }
};

// def a function to update business info
const updateBusinessInfo = async (req: Request, res: Response) => {
    try {
        if (req.body.role !== "staff") {
            return;
        }

        const businessId = req.headers["business-id"];

        // validate headers
        if (!businessId) {
            console.log("businessId is required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // retrieve the business info from the request body
        const {
            name,
            addressLine1,
            addressLine2,
            city,
            state,
            zip,
            country,
            phoneNumber,
            // email,
            logoURL,
            description,
            managerName,
        } = req.body;

        // check the existence of the business and update using findOneAndUpdate
        const updateBusiness = await businessInfo.findOneAndUpdate(
            { businessId },
            {
                $set: {
                    name,
                    addressLine1,
                    addressLine2,
                    city,
                    state,
                    zip,
                    country,
                    phoneNumber,
                    // altEmail: email,
                    logoURL,
                    description,
                    managerName,
                },
            },
            { returnDocument: "after" }
        );

        // check updateBusiness
        if (!updateBusiness) {
            console.log(
                "can't execute the businessInfo.findOneAndUpdate successfully"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        // send a success message to the client
        res.status(200).json(updateBusiness);
    } catch (error) {
        console.log("Error in updateBusinessInfo: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" });
    }
};

// use to count the number of businesses will be deleted
const businessIdToDelete = 1;

// def a function to delete business
const deleteBusiness = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"];

        // validate headers
        if (!businessId) {
            console.log("businessId is required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the businessId exists
        const business = await businessInfo.findOne({
            businessId,
        });

        // if the business doesn't exist, return a 404 response to the client
        if (!business) {
            console.log("Business not found");

            return res.status(404).json({ message: "There is sort of error" });
        }

        // connect to the MongoDB
        await client.connect();

        // Get list of databases
        const adminDb = client.db().admin();
        const databases = await adminDb.listDatabases();

        for (const dbInfo of databases.databases) {
            const dbName = dbInfo.name;
            const db = client.db(dbName);

            // Get list of collections in the database
            const collections = await db.listCollections().toArray();

            for (const collectionInfo of collections) {
                const collectionName = collectionInfo.name;

                // Delete documents where businessId matches the specified value
                const result = await db
                    .collection(collectionName)
                    .deleteMany({ businessId: businessIdToDelete });
                console.log(
                    `Deleted ${result.deletedCount} documents from ${dbName}.${collectionName}`
                );
            }
        }

        // check if the businessId exists in any of the collections
        let businessIdExists = false;
        for (const dbInfo of databases.databases) {
            const dbName = dbInfo.name;
            const db = client.db(dbName);

            // Get list of collections in the database
            const collections = await db.listCollections().toArray();

            for (const collectionInfo of collections) {
                const collectionName = collectionInfo.name;

                // Check if any document with the businessId still exists
                const count = await db
                    .collection(collectionName)
                    .countDocuments({ businessId: businessIdToDelete });
                if (count > 0) {
                    businessIdExists = true;
                    console.log(
                        `BusinessId ${businessIdToDelete} still exists in ${dbName}.${collectionName}`
                    );
                }
            }
        }

        if (!businessIdExists) {
            console.log(
                `BusinessId ${businessIdToDelete} does not exist in any collection across all databases.`
            );
        } else {
            console.log(
                `BusinessId ${businessIdToDelete} still exists in some collections across the databases.`
            );
        }

        // send a success message to the client
        res.status(200).json({ message: "Business deleted successfully" });
    } catch (error) {
        console.log("Error in deleteBusiness: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" });
    }
};

export default {
    createBusinessInfo,
    getBusinessInfo,
    getBusinessStaffInfoForBusiness,
    updateBusinessInfo,
    deleteBusiness,
};
