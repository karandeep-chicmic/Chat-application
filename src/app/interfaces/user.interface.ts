export interface user {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNo?: number;
  dateOfBirth?: Date;
}

export interface forgotPass {
  email?: string;
  urldirect?: string;
}
