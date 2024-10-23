import { MongoClient } from "mongodb";

// define the MongoDB connection URL
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_URL as string;

// create a new MongoClient instance for the whole auth service
export const client = new MongoClient(MONGODB_CONNECTION_STRING);

// connect to the Staff_work_management_DB database
export const loyaltyProgramDB = client.db("Loyalty_program_DB");
