import { Request, Response } from "express";
import "dotenv/config";

import { loadCsvFromAWSS3 } from "../../utils";

// def a function to get the appointment analytics for hourly aggregates
export const getAppointmentAnalyticsHourly = async (
    req: Request,
    res: Response
) => {
    try {
        const bucketName = "ezez-data-storage-test";
        const businessId = "5Q0IjvPaNlWJQzWrJB2gmjh71wl1";
        const analyticsType = "appointment/hourly_aggregates";
        const year = "2024";
        const month = "06";
        const fileName = `${businessId}__${year}__${month}__hourly_aggregates.csv`;

        // define the key for the appointment data
        const key = `${businessId}/${analyticsType}/${year}/${month}/${fileName}`;

        // load the csv file from AWS S3
        const results = await loadCsvFromAWSS3(bucketName, key);

        // return the results
        res.status(200).json({ results });
    } catch (error) {
        console.log("Error in getAppointmentAnalytics: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is some sort of error" }); // don't expose the error message to the client
    }
};

// def a function to get the appointment analytics for weekday aggregates
export const getAppointmentAnalyticsWeekday = async (
    req: Request,
    res: Response
) => {
    try {
        const bucketName = "ezez-data-storage-test";
        const businessId = "5Q0IjvPaNlWJQzWrJB2gmjh71wl1";
        const analyticsType = "appointment/weekday_aggregates";
        const year = "2024";
        const month = "06";
        const fileName = `${businessId}__${year}__${month}__weekday_aggregates.csv`;

        // define the key for the appointment data
        const key = `${businessId}/${analyticsType}/${year}/${month}/${fileName}`;

        // load the csv file from AWS S3
        const results = await loadCsvFromAWSS3(bucketName, key);

        // return the results
        res.status(200).json({ results });
    } catch (error) {
        console.log("Error in getAppointmentAnalytics: ", error); // log the error for debugging purposes
        res.status(500).json({ message: "There is some sort of error" }); // don't expose the error message to the client
    }
};

export default {
    getAppointmentAnalyticsHourly,
    getAppointmentAnalyticsWeekday,
};
