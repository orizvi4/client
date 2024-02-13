export interface UserDTO {
    // whenCreated: string;
    givenName: string;//first name
    sn: string;//last name
    group: string;
    mail: string;
    telephoneNumber: string;
    isEdit: boolean;
    isNew?: boolean;
    isBlocked?: boolean;
    accessToken?: string;
    refreshToken?: string;
}