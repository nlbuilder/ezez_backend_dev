export interface ITime {
    hours: number;
    minutes: number;
}

// def an interface for bookingInfo
export interface IAppointmentInfo {
    appointmentId: string;
    businessId: string;
    businessBranchName: string;
    businessBranchCode: string;
    customerId: string;
    serviceId: string;
    dateString: string;
    dateDate: Date;
    timeString: ITime; // e.g., { hours: 14, minutes: 30 }
    timeDate: Date;
    roundedTime: ITime; // e.g., { hours: 15, minutes: 0 }
    numberOfCustomers: number;
    serviceName: string;
    customerPhoneNumber: string;
    status: string;
    notes: string;
}
