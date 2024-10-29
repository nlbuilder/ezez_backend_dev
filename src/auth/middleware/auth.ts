import { admin } from "../config/firebase";
import { NextFunction, Request, Response } from "express";
import { businessDB } from "../mongodb/mongodbClient";

// def a reference to the business_info collection
const businessInfo = businessDB.collection("business_info");

// def a function to parse the JWT
export const jwtParse = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // get auth token from request header (i.e., authorization header sent from the client side)
    const { authorization } = req.headers;

    // if the auth token doesn't exist, return a 401 response to the client
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Access Denied due to missing token" });
    }

    // get the token from auth token (i.e., authorization header sent from the client side)
    const token = authorization.split(" ")[1];

    try {
        // decode the token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);
        const businessId = decodedToken.sub;

        // find the business in the database
        const business = await businessInfo.findOne({ businessId });

        // if the business doesn't exist, return a 401 response to the client side
        if (!business) {
            return res
                .status(401)
                .json({ message: "Access Denied due to no businessId found" });
        }

        next();
    } catch (error) {
        console.error("Error parsing JWT [jwtParse error message]:", error); // log the error for debugging purposes in the backend
        // if the token is invalid, return a 401 response to the client
        res.status(401).json({ message: "Access Denied" });
    }
};
