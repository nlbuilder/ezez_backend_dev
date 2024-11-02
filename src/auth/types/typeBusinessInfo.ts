// def an interface for businessInfo
export interface IBusinessInfo {
    businessId: string;
    name: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phoneNumber?: string;
    email: string;
    logoURL?: string;
    description?: string;
    managerName?: string[];
    listOfStaff: IBusinessStaffInfoBrief[];
    capacity?: number;
    role: string;
}

export interface IBusinessStaffInfoBrief {
    businessStaffId: string;
    name: string;
    phoneNumber: string;
    email: string;
    photoURL?: string;
    role: string;
}

// def an interface for businessStaffInfo
export interface IBusinessStaffInfoDetails {
    businessStaffId: string;
    businessId: string;
    firstName: string;
    lastName: string;
    Sex?: string;
    DOB?: Date;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phoneNumber: string;
    email?: string;
    photoURL?: string;
    role?: string;
}
