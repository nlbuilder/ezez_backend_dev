import { Request, Response } from "express";
import "dotenv/config";
import { getAuth } from "firebase-admin/auth";

import { businessDB } from "../mongodb/mongodbClient";

// def a reference to the business_staff_info collection
const businessStaffInfo = businessDB.collection("business_staff_info");

// def a function to create a new business staff
const createBusinessStaff = async (req: Request, res: Response) => {
    try {
        const {
            businessId,
            name,
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

        // validate the request body
        if (
            !businessId ||
            !name ||
            !addressLine1 ||
            !city ||
            !state ||
            !zip ||
            !country ||
            !phoneNumber ||
            !email ||
            !password ||
            !photoURL ||
            !role
        ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // create a new staff user on Firebase Auth
        const staffRecord = await getAuth().createUser({
            email: email,
            password: password,
            emailVerified: false,
            displayName: name,
            phoneNumber: phoneNumber,
            photoURL: photoURL,
            disabled: false,
        });

        // create a new staff and save it to the business_staff_info collection
        // using findOneAndUpdate with upsert option
        const staff = await businessStaffInfo.findOneAndUpdate(
            { businessId, businessStaffId: staffRecord.uid },
            {
                $set: {
                    businessId,
                    name,
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
            { upsert: true }
        );

        // check the execution of findOneAndUpdate
        if (!staff) {
            console.log(
                "can't execute the businessStaffInfo.findOneAndUpdate() sucessfully  "
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        res.status(201).json({ message: "A staff created successfully" });
    } catch (error) {
        console.log("Error in createBusinessStaff: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to get business staff info
const getBusinessStaffInfo = async (req: Request, res: Response) => {
    try {
        const businessStaffId = req.headers["businessstaff-id"];

        // validate headers
        if (!businessStaffId) {
            console.log("businessStaffId is required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the businessStaffId exists
        const staff = await businessStaffInfo.findOne({
            businessStaffId,
        });

        if (!staff) {
            console.log("No staff found");

            return res.status(404).json({ message: "staff not found" });
        }

        res.status(200).json(staff);
    } catch (error) {
        console.log("Error in getBusinessInfo: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to update staff info
const updateBusinessStaffInfo = async (req: Request, res: Response) => {
    try {
        const businessStaffId = req.headers["businessstaff-id"];

        // validate headers
        if (!businessStaffId) {
            console.log("businessStaffId is required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // retrieve the staff info from the request body
        const {
            name,
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
        } = req.body;

        // update the staff info using findOneAndUpdate
        const updateStaff = await businessStaffInfo.findOneAndUpdate(
            { businessStaffId },
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
                    altEmail: email,
                    photoURL,
                    role,
                },
            },
            { returnDocument: "after" }
        );

        res.status(200).json(updateStaff);
    } catch (error) {
        console.log("Error in updateBusinessStaffInfo: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" });
    }
};

// def a function to delete staff
const deleteBusinessStaff = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"];
        const businessStaffId = req.headers["businessstaff-id"];

        // validate headers
        if (!businessId || !businessStaffId) {
            console.log("businessId and businessStaffId are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check the existence of the staff and delete using findOneAndDelete
        const deleteStaff = await businessStaffInfo.findOneAndDelete({
            businessId,
            businessStaffId,
        });

        // check deleteStaff
        if (!deleteStaff || !deleteStaff.value) {
            console.log(
                "can't execute the businessStaffInfo.findOneAndDelete() sucessfully"
            );

            return res.status(404).json({ message: "There is sort of error" });
        }

        res.status(200).json({ message: "Staff deleted successfully" });
    } catch (error) {
        console.log("Error in deleteBusiness: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" });
    }
};

export default {
    createBusinessStaff,
    getBusinessStaffInfo,
    updateBusinessStaffInfo,
    deleteBusinessStaff,
};
