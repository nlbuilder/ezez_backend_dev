export interface ILoyaltyCard {
    businessId: string;
    customerId: string;
    numberOfRewardPoints: number;
    numberOfRedeemablePoints: number;
    numberOfRedemptions: number;
    lastUpdated: Date;
}
