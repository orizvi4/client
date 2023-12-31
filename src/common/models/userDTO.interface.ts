export interface UserDTO {
    userPrincipalName: string;//username
    givenName: string;//first name
    sn: string;//last name
    whenCreated: string;
    isEdit: boolean;
    group: string;
    accessToken?: string;
    refreshToken?: string;
}