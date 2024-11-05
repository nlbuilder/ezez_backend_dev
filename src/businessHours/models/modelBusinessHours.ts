import { Schema, model } from "mongoose";
import { BusinessHours } from "../types/typeBusinessHours";

// def a schema for business_hours_info
const businessHoursSchema = new Schema<BusinessHours>({
    businessId: { type: String, required: true },
    businessBranchCode: { type: String, required: true },
    startTime: { type: String, required: true },
    finishTime: { type: String, required: true },
});

// create a model for the schemas
const BusinessHours = model<BusinessHours>(
    "business_hour_info",
    businessHoursSchema
);

// export the model
export { BusinessHours };
