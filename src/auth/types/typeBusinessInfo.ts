// def an interface for businessInfo
export interface IBusinessInfo {
    businessId: string;
    name: string;
    businessBranchInfos?: businessBranchInfo[];
    // addressLine1?: string;
    // addressLine2?: string;
    // city?: string;
    // state?: string;
    // zip?: string;
    // country?: string;
    // phoneNumber?: string;
    email: string;
    // logoURL?: string;
    // description?: string;
    // managerName?: string[];
    // capacity?: number;
    role: string;
    listOfStaff: IBusinessStaffInfoBrief[];
}

export interface businessBranchInfo {
    businessBranchName: string;
    businessBranchCode: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phoneNumber?: string;
    email?: string;
    logoURL?: string;
    description?: string;
    managerName?: string[];
    capacity?: number;
}

export interface IBusinessStaffInfoBrief {
    businessBranchName: string;
    businessBranchCode: string;
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
    businessBranchName: string;
    businessBranchCode: string;
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
