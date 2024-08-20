import { Schema, model } from "mongoose";
import { IAppointmentInfo } from "../types/typeAppointmentInfo";

// def a schema for bookingInfo
const appointmentInfoSchema = new Schema<IAppointmentInfo>({
    appointmentId: { type: String, required: true, unique: true },
    businessId: { type: String, required: true },
    customerId: { type: String, required: true },
    serviceId: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    numberOfCustomers: { type: Number, required: true, default: 1 },
    serviceName: { type: String, required: true },
    customerPhoneNumber: { type: String, required: true },
    status: { type: String },
    notes: { type: String },
});

// create a model for the schemas
const AppointmentInfo = model<IAppointmentInfo>(
    "appointment_info",
    appointmentInfoSchema
);

// export the model
export { AppointmentInfo };
