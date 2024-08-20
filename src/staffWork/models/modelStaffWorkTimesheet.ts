import { Schema, model } from "mongoose";
import { IDailyStaffWorkTimesheet } from "../types/typeStaffWorkTimesheet";

// define a schema for dailyWorkTimesheet
const DailyStaffWorkTimesheetSchema = new Schema<IDailyStaffWorkTimesheet>({
    businessId: { type: String, required: true },
    businessStaffId: { type: String, required: true },
    weekStart: { type: Date, required: true },

    date: { type: Date, required: true },

    checkIn: {
        type: Date,
        default: () => new Date().setHours(0, 0, 0, 0), // sets time to 00:00
    },
    checkOut: {
        type: Date,
        default: () => new Date().setHours(0, 0, 0, 0), // sets time to 00:00
    },
    totalHours: { type: Number, required: true, default: 0 },
    managerApproval: { type: Boolean, required: true },
});

// create models for the schemas
const DailyStaffWorkTimesheet = model<IDailyStaffWorkTimesheet>(
    "daily_staff_work_timesheet",
    DailyStaffWorkTimesheetSchema
);

// export the models
export { DailyStaffWorkTimesheet };
