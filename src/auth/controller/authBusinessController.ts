import { Request, Response } from "express";
import "dotenv/config";

import { client } from "../mongodb/mongodbClient";
import { businessDB } from "../mongodb/mongodbClient";
import { getAuth } from "firebase-admin/auth";

// def a reference to the business_info collection
const businessInfo = businessDB.collection("business_info");

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

// def a function to update business info
const updateBusinessInfo = async (req: Request, res: Response) => {
    try {
        if (req.body.role === "staff") {
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
            email,
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
                    email,
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

// def a function to delete business
const deleteBusiness = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"] as string;

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

        // check Business_service_DB database
        // connect to the Business_service_DB database
        const businessServiceDB = client.db("Business_service_DB");

        // def a reference to the business_service_info collection
        const businessServiceInfo = businessServiceDB.collection(
            "business_service_info"
        );

        // check and delete everything related to the businessId in the business_service_info collection
        const deleteBusinessServiceInfo = await businessServiceInfo.deleteMany({
            businessId,
        });

        // check deleteBusinessServiceInfo
        if (!deleteBusinessServiceInfo) {
            console.log(
                "can't execute the businessServiceInfo.deleteMany successfully"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        // check Appointment_DB database
        // connect to the Appointment_DB database
        const appointmentDB = client.db("Appointment_DB");

        // def a reference to the appointment_info collection
        const appointmentInfo = appointmentDB.collection("appointment_info");

        // check and delete everything related to the businessId in the appointment_info collection
        const deleteAppointmentInfo = await appointmentInfo.deleteMany({
            businessId,
        });

        // check deleteAppointmentInfo
        if (!deleteAppointmentInfo) {
            console.log(
                "can't execute the appointmentInfo.deleteMany successfully"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        // check Staff_work_timesheet_DB database
        // connect to the Staff_work_timesheet_DB database
        const staffWorkTimeSheetDB = client.db("Staff_work_timesheet_DB");

        // def a reference to the daily_staff_work_timesheet collection
        const dailyStaffWorkTimeSheet = staffWorkTimeSheetDB.collection(
            "daily_staff_work_timesheet"
        );

        // check and delete everything related to the businessId in the daily_staff_work_timesheet collection
        const deleteDailyStaffWorkTimeSheet =
            await dailyStaffWorkTimeSheet.deleteMany({
                businessId,
            });

        // check deleteDailyStaffWorkTimeSheet
        if (!deleteDailyStaffWorkTimeSheet) {
            console.log(
                "can't execute the dailyStaffWorkTimeSheet.deleteMany successfully"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        // check Business_DB database
        // check and delete everything related to the businessId in the business_hour_info collection
        const businessHourInfo = businessDB.collection("business_hour_info");
        const deleteBusinessHourInfo = await businessHourInfo.deleteMany({
            businessId,
        });

        // check deleteBusinessHourInfo
        if (!deleteBusinessHourInfo) {
            console.log(
                "can't execute the businessHourInfo.deleteMany successfully"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        // check and delete everything related to the businessId in the business_info collection
        const deleteBusinessInfo = await businessInfo.deleteOne({
            businessId,
        });

        // check deleteBusinessInfo
        if (!deleteBusinessInfo) {
            console.log(
                "can't execute the businessInfo.deleteOne successfully"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        // check and delete user from firebase
        getAuth()
            .deleteUser(businessId)
            .then(() => {
                console.log("Successfully deleted user");
            })
            .catch((error) => {
                console.log("Error deleting user:", error);
            });

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
    updateBusinessInfo,
    deleteBusiness,
};
