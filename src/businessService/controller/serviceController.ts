import { Request, Response } from "express";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";

import { businessServiceDB } from "../mongodb/mongodbClient";
import initServices from "../../init/initServices.json";

// def a reference to the business_service_info collection
const businessServiceInfo = businessServiceDB.collection(
    "business_service_info"
);

// def a function to create a new service
const createService = async (req: Request, res: Response) => {
    try {
        const {
            businessId,
            businessBranchName,
            businessBranchCode,
            serviceId,
            serviceName,
            photoUrl,
            price,
            note,
        } = await req.body;

        // validate the request body
        if (!businessId || !serviceId || !serviceName || !price) {
            console.log("Missing required fields");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the service already exists else create a new one using findOneAndUpdate
        const service = await businessServiceInfo.findOneAndUpdate(
            { businessId, serviceId },
            {
                $setOnInsert: {
                    businessId,
                    businessBranchName,
                    businessBranchCode,
                    serviceId,
                    serviceName,
                    photoUrl,
                    price,
                    note,
                },
            },
            { upsert: true, returnDocument: "after" }
        );

        // check the existance of the service after executing the findOneAndUpdate
        if (!service) {
            console.log(
                "Error when executing findOneAndUpdate() for createService() "
            );

            return res.status(200).send({ message: "There is sort of error" });
        }

        return res.status(201).send({ message: "service created" });
    } catch (error) {
        console.log("Error in createService: ", error); // log the error for debugging purposes

        res.status(500).json({ message: "There is sort of error" });
    }
};

// def a function to create multiple services for the given businessId
const createInitServices = async (req: Request, res: Response) => {
    try {
        const {
            businessId,
            chosenOption,
            businessBranchName,
            businessBranchCode,
        } = req.body;

        // validate the request body
        if (!businessId || !chosenOption) {
            console.log("Missing required fields");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // filter the matching option from initServiceInfo
        const selectedOption = initServices.find(
            (option) => option.option === chosenOption
        );

        if (!selectedOption) {
            return res.status(404).json({ message: "Option not found" });
        }

        // Loop through the selected option's details and create services
        for (const serviceDetail of selectedOption.details) {
            const { serviceName, price } = serviceDetail;

            const service = await businessServiceInfo.findOneAndUpdate(
                { businessId, serviceName }, // Ensure uniqueness by businessId and serviceName
                {
                    $setOnInsert: {
                        businessId,
                        businessBranchName,
                        businessBranchCode,
                        serviceId: uuidv4(),
                        serviceName,
                        photoUrl: "",
                        price,
                        note: "",
                    },
                },
                { upsert: true, returnDocument: "after" }
            );

            // console.log(`Service Created/Updated: ${JSON.stringify(service)}`);
        }

        return res.status(201).send({ message: "initial services created" });
    } catch (error) {
        console.log("Error in createMultipleServices: ", error); // log the error for debugging purposes

        res.status(500).json({ message: "There is sort of error" });
    }
};

// def a function to get service info for the given businessId
// this function will be used to get all the services for the given businessId
const getServiceInfo = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"];
        const serviceId = req.headers["service-id"];

        // validate headers
        if (!businessId || !serviceId) {
            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the service exists for the given businessId and serviceId
        const serviceInfo = await businessServiceInfo.findOne({
            businessId,
            serviceId,
        });

        // check the existance of the service
        if (!serviceInfo) {
            return res.status(404).json({ message: "service not found" });
        }

        res.status(200).json(serviceInfo);
    } catch (error) {
        console.log("Error in getService: ", error); // log the error for debugging purposes

        res.status(500).json({ message: "There is sort of error" });
    }
};

// def a function to get all services for the given businessId
const getAllServicesInfo = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"];

        // validate headers
        if (!businessId) {
            console.log("businessId is required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the services exist for the given businessId
        const allServices = await businessServiceInfo
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
        if (allServices.length === 0) {
            // console.log("allServices: ", allServices);

            return res.status(404).json({ message: "There is sort of error" });
        }

        res.status(200).json(allServices);
    } catch (error) {
        console.log("Error in getAllServices: ", error); // log the error for debugging purposes

        res.status(500).json({ message: "There is sort of error" });
    }
};

// def a function to update service info for the given businessId and serviceId
const updateServiceInfo = async (req: Request, res: Response) => {
    try {
        const { businessId, serviceId, serviceName, photoUrl, price, note } =
            await req.body;

        // validate the request body
        if (!businessId || !serviceId || !serviceName || !price) {
            console.log("Missing required fields");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the service exists for the given businessId and serviceId
        const updateService = await businessServiceInfo.findOneAndUpdate(
            { businessId, serviceId },
            {
                $set: {
                    serviceName,
                    photoUrl,
                    price,
                    note,
                },
            },
            { returnDocument: "after" }
        );

        // check if the service was updated successfully
        if (!updateService) {
            console.log(
                "Error when executing findOneAndUpdate() for service update"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        res.status(200).json(updateService);
    } catch (error) {
        console.log("Error in updateService: ", error); // log the error for debugging purposes

        res.status(500).json({ message: "There is sort of error" });
    }
};

// def a function to delete service info for the given businessId and serviceId
const deleteService = async (req: Request, res: Response) => {
    try {
        const businessId = req.headers["business-id"];
        const serviceId = req.headers["service-id"];

        // validate headers
        if (!businessId || !serviceId) {
            console.log("businessId and serviceId are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the service exists for the given businessId and serviceId
        // and delete using findOneAndDelete
        const deleteService = await businessServiceInfo.findOneAndDelete({
            businessId,
            serviceId,
        });

        // check if the service was deleted successfully
        if (!deleteService) {
            console.log("Error when executing findOneAndDelete() for service");

            return res.status(500).json({ message: "There is sort of error" });
        }

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        console.log("Error in deleteService: ", error); // log the error for debugging purposes

        res.status(500).json({ message: "There is sort of error" });
    }
};

export default {
    createService,
    createInitServices,
    getServiceInfo,
    getAllServicesInfo,
    updateServiceInfo,
    deleteService,
};
