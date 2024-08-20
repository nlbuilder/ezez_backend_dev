import { Schema, model } from "mongoose";
import { IServiceInfo } from "../types/typeServiceInfo";

// def a schema for service info
const serviceInfoSchema = new Schema<IServiceInfo>({
    businessId: { type: String, required: true },
    serviceId: { type: String, required: true, unique: true },
    serviceName: { type: String, required: true },
    photoUrl: { type: String },
    price: { type: Number, required: true },
    note: { type: String },
});

// create a model for the schemas
const ServiceInfo = model<IServiceInfo>(
    "business_service_info",
    serviceInfoSchema
);

// export the model
export { ServiceInfo };
