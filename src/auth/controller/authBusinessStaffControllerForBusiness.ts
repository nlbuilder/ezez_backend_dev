import { Request, Response } from "express";
import "dotenv/config";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";

// import { client } from "../mongodb/mongodbClient";
import { businessDB } from "../mongodb/mongodbClient";

// def a reference to the business_info and business_staff_info collection
const businessInfo = businessDB.collection("business_info");
const businessStaffInfo = businessDB.collection("business_staff_info");

// def a function to create a new business staff
const createBusinessStaff = async (req: Request, res: Response) => {
    try {
        const {
            // businessId,
            businessBranchName,
            businessBranchCode,
            name,
            DOB,
            Sex,
            addressLine1,
            addressLine2,
            city,
            state,
            zip,
            country,
            phoneNumber,
            email,
            password,
            photoURL,
            role,
        } = req.body;

        const businessId = req.headers["business-id"] as string;

        // validate the request body
        if (
            // !businessId ||
            !name ||
            // !addressLine1 ||
            // !city ||
            // !state ||
            // !zip ||
            // !country ||
            // !phoneNumber ||
            !email ||
            !password ||
            // !photoURL ||
            !role
        ) {
            console.log("Missing required fields");
            return res.status(400).json({ message: "Missing required fields" });
        }

        // create a new staff user on Firebase Auth
        const staffRecord = await getAuth().createUser({
            email: email,
            password: password,
            emailVerified: false,
            displayName: name,
            // phoneNumber: phoneNumber,
            // photoURL: photoURL,
            disabled: false,
        });

        // split the staffRecord.displayName into first name and last name
        const nameArr = staffRecord.displayName?.split(" ");
        const firstName = nameArr?.[0];
        const lastName = nameArr?.[1];

        // create a new staff and save it to the business_staff_info collection
        // using findOneAndUpdate with upsert option
        const staffDetails = await businessStaffInfo.findOneAndUpdate(
            { businessId, businessStaffId: staffRecord.uid },
            {
                $set: {
                    businessId,
                    businessBranchName,
                    businessBranchCode,
                    businessStaffId: staffRecord.uid,
                    firstName,
                    lastName,
                    DOB,
                    Sex,
                    addressLine1,
                    addressLine2,
                    city,
                    state,
                    zip,
                    country,
                    phoneNumber,
                    email,
                    photoURL,
                    role,
                },
            },
            { upsert: true, returnDocument: "after" }
        );

        // check the execution of findOneAndUpdate
        if (!staffDetails) {
            console.log(
                "can't execute the businessStaffInfo.findOneAndUpdate() sucessfully  "
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        // create a brief copy of the staffDetails and add it to the business_info collection
        const newStaffBrief = {
            businessBranchName,
            businessBranchCode,
            businessStaffId: staffDetails.businessStaffId,
            name: name,
            phoneNumber: phoneNumber,
            email: email,
            photoURL: photoURL,
            role: role,
        };

        const staffBrief = await businessInfo.findOneAndUpdate(
            {
                businessId: businessId,
            },
            {
                $addToSet: {
                    listOfStaff: newStaffBrief,
                },
            }
        );

        if (!staffBrief) {
            console.log(
                "can't execute the businessInfo.findOneAndUpdate() to add staffBriefInfo to businessInfo sucessfully"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        res.status(201).json({ message: "A staff created successfully" });
    } catch (error) {
        console.log("Error in createBusinessStaff: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to get all staff info working for a business
const getBusinessStaffInfoForBusiness = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"] as string;

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
            return res.status(404).json({ message: "staff not found" });
        }

        res.status(200).json(staffs);
    } catch (error) {
        console.log("Error in getBusinessInfo: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" });
    }
};

// def a function to delete staff
const deleteBusinessStaff = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"] as string;
        const businessStaffId = req.headers["businessstaff-id"] as string;

        // validate headers
        if (!businessId || !businessStaffId) {
            console.log("businessId and businessStaffId are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check the existence of the staff in the business_staff_info collection
        // and delete the specified staff using findOneAndDelete
        const deleteStaff = await businessStaffInfo.findOneAndDelete({
            businessId,
            businessStaffId,
        });

        // check deleteStaff
        if (!deleteStaff) {
            console.log(
                "can't execute the businessStaffInfo.findOneAndDelete() sucessfully"
            );

            return res.status(404).json({ message: "There is sort of error" });
        }

        // check the existence of the staff in the business_info collection
        // more specifically, in the listOfStaff field
        // and delete the specified staff using findOneAndUpdate
        const deleteStaffBrief = await businessInfo.updateOne(
            {
                businessId: businessId,
            },
            {
                $pull: {
                    listOfStaff: { businessStaffId: businessStaffId } as any,
                },
            }
        );

        // check deleteStaffBrief
        if (!deleteStaffBrief) {
            console.log(
                "can't execute the businessInfo.findOneAndUpdate() to delete staffBriefInfo from businessInfo sucessfully"
            );

            return res.status(404).json({ message: "There is sort of error" });
        }

        // check the existence of the staff in the firebase auth
        // and delete the specified staff using deleteUser
        getAuth()
            .deleteUser(businessStaffId)
            .then(() => {
                console.log("Successfully deleted user");
            })
            .catch((error) => {
                console.log("Error deleting user:", error);
            });

        res.status(200).json({ message: "Staff deleted successfully" });
    } catch (error) {
        console.log("Error in deleteBusiness: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" });
    }
};

export default {
    createBusinessStaff,
    getBusinessStaffInfoForBusiness,
    deleteBusinessStaff,
};
