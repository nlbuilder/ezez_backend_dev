import { Schema, model } from "mongoose";

import {
    IBusinessInfo,
    IBusinessStaffInfoBrief,
    IBusinessStaffInfoDetails,
} from "../types/typeBusinessInfo";

// def a schema for businessStaffBriefInfo
const businessStaffInfoBriefSchema = new Schema<IBusinessStaffInfoBrief>({
    businessStaffId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    photoURL: { type: String },
    role: { type: String, required: true },
});

// def a schema for businessInfo
const businessInfoSchema = new Schema<IBusinessInfo>({
    businessId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
    phoneNumber: { type: String },
    email: { type: String, required: true },
    logoURL: { type: String },
    description: { type: String },
    managerName: { type: String },
    listOfStaff: { type: [businessStaffInfoBriefSchema], default: [] },
    capacity: { type: Number },
});

// def a schema for businessUserInfo
const businessStaffInfoSchema = new Schema<IBusinessStaffInfoDetails>({
    businessStaffId: { type: String, required: true, unique: true },
    businessId: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    DOB: { type: Date },
    Sex: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    photoURL: { type: String },
    role: { type: String },
});

// create models for the schemas
const BusinessInfo = model<IBusinessInfo>("business_info", businessInfoSchema);
const BusinessStaffInfo = model<IBusinessStaffInfoDetails>(
    "business_staff_info",
    businessStaffInfoSchema
);

// export the models
export { BusinessInfo, BusinessStaffInfo };
