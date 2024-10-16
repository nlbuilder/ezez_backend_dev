import { MongoClient } from "mongodb";

// define the MongoDB connection URL
const MONGODB_CONNECTION_STRING =
    process.env.MONGODB_CONNECTION_URL || "mongodb://localhost:27017";

// create a new MongoClient instance for the whole auth service
export const client = new MongoClient(MONGODB_CONNECTION_STRING);

// connect to the Staff_work_management_DB database
export const staffWorkManagementDB = client.db("Staff_work_timesheet_DB");
