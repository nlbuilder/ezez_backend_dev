import { Schema, model } from "mongoose";

import { IBusinessInfo, IBusinessStaffInfo } from "../types/typeBusinessInfo";

// def a schema for businessUserInfo
const businessStaffInfoSchema = new Schema<IBusinessStaffInfo>({
    businessStaffId: { type: String, required: true, unique: true },
    businessId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    photoURL: { type: String },
    role: { type: String },
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
});

// create models for the schemas
const BusinessInfo = model<IBusinessInfo>("business_infos", businessInfoSchema);
const BusinessStaffInfo = model<IBusinessStaffInfo>(
    "business_staff_infos",
    businessStaffInfoSchema
);

// export the models
export { BusinessInfo, BusinessStaffInfo };
