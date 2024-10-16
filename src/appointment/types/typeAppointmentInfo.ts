export interface ITime {
    hours: number;
    minutes: number;
}

// def an interface for bookingInfo
export interface IAppointmentInfo {
    appointmentId: string;
    businessId: string;
    customerId: string;
    serviceId: string;
    date: Date;
    time: ITime; // e.g., { hours: 14, minutes: 30 }
    roundedTime: ITime; // e.g., { hours: 15, minutes: 0 }
    numberOfCustomers: number;
    serviceName: string;
    customerPhoneNumber: string;
    status: string;
    notes: string;
}
