import { Request, Response } from "express";
import "dotenv/config";

import { loyaltyProgramDB } from "../mongodb/mongodbClient";

// def a reference to the loyalty_card collection
const loyaltyCardCollection = loyaltyProgramDB.collection("loyalty_card");

// def a function to create a new loyalty card
const createLoyaltyCard = async (req: Request, res: Response) => {
    try {
        const { customerId, businessId } = req.body;

        // validate the request body
        if (!customerId || !businessId) {
            console.log("customerId and businessId are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the loyalty card already exists else create a new one using findOneAndUpdate
        const loyaltyCard = await loyaltyCardCollection.findOneAndUpdate(
            { customerId, businessId },
            {
                $setOnInsert: {
                    customerId,
                    businessId,
                    points: 0,
                },
            },
            { upsert: true, returnDocument: "after" }
        );

        // check the loyalty card
        if (!loyaltyCard) {
            console.log(
                "can't execute loyaltyCardCollection.findOneAndUpdate() successfully"
            );

            return res.status(200).send({ message: "There is sort of error" });
        }

        res.status(201).json({ message: "Loyalty card created successfully" });
    } catch (error) {
        console.log("Error in createLoyaltyCard: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is some sort of error" }); // don't expose the error message to the client
    }
};

// def a function to get loyalty card info
const getLoyaltyCardInfo = async (req: Request, res: Response) => {
    try {
        const customerId = req.headers["customer-id"];
        const businessId = req.headers["business-id"];

        // validate headers
        if (!customerId || !businessId) {
            console.log("customerId and businessId are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the loyalty card exists
        const loyaltyCard = await loyaltyCardCollection.findOne({
            customerId,
            businessId,
        });

        if (!loyaltyCard) {
            console.log("No loyalty card found");

            return res.status(404).json({ message: "loyalty card not found" });
        }

        res.status(200).json(loyaltyCard);
    } catch (error) {
        console.log("Error in getLoyaltyCardInfo: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is some sort of error" }); // don't expose the error message to the client
    }
};

// def a function to update loyalty card info
const updateLoyaltyCardInfo = async (req: Request, res: Response) => {
    try {
        const customerId = req.headers["customer-id"];
        const businessId = req.headers["business-id"];

        // validate headers
        if (!customerId || !businessId) {
            console.log("customerId and businessId are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // update the loyalty card info using findOneAndUpdate
        const updateLoyaltyCard = await loyaltyCardCollection.findOneAndUpdate(
            { customerId, businessId },
            {
                $set: {
                    ...req.body,
                },
            },
            { returnDocument: "after" }
        );

        // check the updateLoyaltyCard
        if (!updateLoyaltyCard) {
            console.log(
                "can't execute the loyaltyCardCollection.findOneAndUpdate() successfully"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        res.status(200).json(updateLoyaltyCard);
    } catch (error) {
        console.log("Error in updateLoyaltyCardInfo: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is some sort of error" }); // don't expose the error message to the client
    }
};

// def a function to delete loyalty card info
const deleteLoyaltyCard = async (req: Request, res: Response) => {
    try {
        const customerId = req.headers["customer-id"];
        const businessId = req.headers["business-id"];

        // validate headers
        if (!customerId || !businessId) {
            console.log("customerId and businessId are required");

            return res.status(400).json({ message: "There is sort of error" });
        }

        // check if the loyalty card exists and delete using findOneAndDelete
        const deleteLoyaltyCard = await loyaltyCardCollection.findOneAndDelete({
            customerId,
            businessId,
        });

        // check if the loyalty card was deleted successfully
        if (!deleteLoyaltyCard) {
            console.log(
                "Error when executing findOneAndDelete() for loyalty card"
            );

            return res.status(500).json({ message: "There is sort of error" });
        }

        res.status(200).json({ message: "Loyalty card deleted successfully" });
    } catch (error) {
        console.log("Error in deleteLoyaltyCard: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is some sort of error" }); // don't expose the error message to the client
    }
};

export default {
    createLoyaltyCard,
    getLoyaltyCardInfo,
    updateLoyaltyCardInfo,
    deleteLoyaltyCard,
};
