import { Document } from "mongoose";

// def an interface for customerUserInfo
export interface ICustomerUserInfo {
    customerUserId: string;
    customerName: string;
    customerDOB?: Date;
    customerPhoneNumber: string;
    customerAddress?: string;
}
