import { Request, Response } from "express";
import "dotenv/config";

import { appointmentDB } from "../mongodb/mongodbClient";

// def a reference to the appointment_info collection
const appointmentInfo = appointmentDB.collection("appointment_info");

// def a function to create a new appointment
const createAppointment = async (req: Request, res: Response) => {
    try {
        const {
            appointmentId,
            businessId,
            customerId,
            serviceId,
            date,
            time,
            roundedTime,
            serviceName,
            numberOfCustomers,
            customerPhoneNumber,
            customerName,
            note,
            status,
        } = req.body;

        // validate the request body
        if (
            !appointmentId ||
            !businessId ||
            !customerId ||
            !serviceId ||
            !date ||
            !time ||
            !numberOfCustomers ||
            !serviceId ||
            !customerPhoneNumber ||
            !status
        ) {
            console.log("Missing required fields");

            return res.status(400).json({ message: "There is sort of error" });
        }

        const appointment = await appointmentInfo.findOneAndUpdate(
            { businessId, appointmentId },
            {
                $setOnInsert: {
                    appointmentId,
                    businessId,
                    customerId,
                    serviceId,
                    date,
                    time,
                    roundedTime,
                    serviceName,
                    numberOfCustomers,
                    customerPhoneNumber,
                    customerName,
                    note,
                    status,
                },
            },
            { upsert: true, returnDocument: "after" }
        );

        if (!appointment) {
            console.log(
                "can't execute the appointment.findOneAndUpdate(appointment) successfully"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        // send a success message to the client
        res.status(201).json({ message: "appointment created successfully" });
    } catch (error) {
        console.log("Error in createAppointment: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to get appointment info
// this function retrieves all appointments for the specified businessId
const getAllAppointmentsInfo = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"] as string;

        // validate the businessId
        if (!businessId) {
            console.log("businessId is required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // retrieve all appointments for the specified businessId
        const appointments = await appointmentInfo
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

        // check if no appointments were found
        if (appointments.length === 0) {
            // console.log("No appointments found for the specified businessId");

            return res.status(404).json({ message: "no appointment found" });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.log("Error in getAppointmentInfo: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to update appointment info
const updateAppointmentInfo = async (req: Request, res: Response) => {
    try {
        const { appointmentId, businessId, ...updateFields } = req.body;

        console.log("updateFields: ", updateFields);
        console.log("appointmentId: ", appointmentId);

        // validate the businessId and appointmentId
        if (!businessId || !appointmentId) {
            console.log("businessId and appointmentId are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // update the appointment info using findOneAndUpdate
        const updateAppointment = await appointmentInfo.findOneAndUpdate(
            { businessId, appointmentId },
            {
                $set: {
                    ...updateFields,
                },
            },
            { returnDocument: "after" }
        );

        // check the updateAppointment
        if (!updateAppointment) {
            console.log(
                "can't execute the appointment.findOneAndUpdate(appointment) successfully"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        res.status(200).json(updateAppointment);
    } catch (error) {
        console.log("Error in updateAppointmentInfo: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

// def a function to delete appointment info
const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"];
        const appointmentId = req.headers["appointment-id"];

        // validate headers
        if (!businessId || !appointmentId) {
            console.log("businessId and appointmentId are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // delete the appointment using findOneAndDelete
        const deleteAppointment = await appointmentInfo.findOneAndDelete({
            businessId,
            appointmentId,
        });

        // check if the deletion wasn't successful
        if (!deleteAppointment) {
            console.log(
                "Error when executing appointmentInfo.findOneAndDelete() successfully"
            );

            return res.status(404).json({ message: "There is sort of error" });
        }

        res.status(200).json({ message: "appointment deleted successfully" });
    } catch (error) {
        console.log("Error in deleteAppointmentInfo: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is sort of error" }); // don't expose the error message to the client
    }
};

export default {
    createAppointment,
    getAllAppointmentsInfo,
    updateAppointmentInfo,
    deleteAppointment,
};
