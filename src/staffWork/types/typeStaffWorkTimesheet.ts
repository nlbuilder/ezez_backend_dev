// def an interface for dailyWorkTimesheet
export interface IDailyStaffWorkTimesheet {
    businessId: string;
    businessStaffId: string;
    weekStart: Date;
    date: Date;
    checkIn: Date | null;
    checkOut: Date | null;
    totalHours: number;
    managerApproval: boolean;
}
