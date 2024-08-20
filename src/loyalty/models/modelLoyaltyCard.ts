import mongoose from "mongoose";

import { ILoyaltyCard } from "../types/typeLoyaltyCard";

// define a schema for loyaltyCard
const LoyaltyCardSchema = new mongoose.Schema<ILoyaltyCard>({
    businessId: { type: String, required: true },
    customerId: { type: String, required: true },
    numberOfRewardPoints: { type: Number, required: true, default: 0 },
    numberOfRedeemablePoints: { type: Number, required: true, default: 0 },
    numberOfRedemptions: { type: Number, required: true, default: 0 },
    lastUpdated: { type: Date, required: true },
});

// create models for the schemas
const LoyaltyCard = mongoose.model<ILoyaltyCard>(
    "loyalty_card",
    LoyaltyCardSchema
);

// export the models
export { LoyaltyCard };
