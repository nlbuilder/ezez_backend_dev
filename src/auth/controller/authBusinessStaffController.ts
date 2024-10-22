import { Request, Response } from "express";
import "dotenv/config";
// import { getAuth } from "firebase-admin/auth";

import { businessDB } from "../mongodb/mongodbClient";

// def a reference to the business_staff_info collection
const businessStaffInfo = businessDB.collection("business_staff_info");
// const businessInfo = businessDB.collection("business_info");

// def a function to get business staff info
const getBusinessStaffInfo = async (req: Request, res: Response) => {
    /// this method is meant to be used by an authenticated staff to get their own info
    // it is not meant to be used by the business manager
    // the business manager should use the useGetBusinessInfoAPI hook instead
    // there is a listOfStaff field that can give a brief information about all staffs
    // also, there is a method, named useGetBusinessStaffInfoForBusinessAPI,
    // that can be used to get all details of all staffs in a business

    try {
        const businessStaffId = req.headers["businessstaff-id"];

        // validate headers
        if (!businessStaffId) {
            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the businessStaffId exists
        const staff = await businessStaffInfo.findOne({
            businessStaffId,
        });

        // this trick is used to handle the case
        // where there is no staff added to the business yet
        if (!staff) {
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

export default {
    // createBusinessStaff,
    getBusinessStaffInfo,
    updateBusinessStaffInfo,
    // deleteBusinessStaff,
};
