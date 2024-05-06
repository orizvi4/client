export interface UserDTO {
    // whenCreated: string;
    givenName: string;//first name
    group: string;
    sn?: string;//last name
    mail?: string;
    telephoneNumber?: string;
    isEdit?: boolean;
    isNew?: boolean;
    isBlocked?: boolean;
    accessToken?: string;
    refreshToken?: string;
}