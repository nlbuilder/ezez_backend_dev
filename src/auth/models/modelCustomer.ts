import { Schema, model } from "mongoose";
import { ICustomerUserInfo } from "../types/typeCustomerInfo";

// def a schema for customerUserInfo
const customerUserInfoSchema = new Schema<ICustomerUserInfo>({
    customerUserId: { tyepe: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerDOB: { type: Date },
    customerPhoneNumber: { type: String, required: true },
    customerAddress: { type: String },
});

// create models for the schemas
const customerUserInfo = model<ICustomerUserInfo>(
    "customer_user_info",
    customerUserInfoSchema
);

// export the models
export { customerUserInfo };
