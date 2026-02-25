export interface SignupData {
    email: string;
    name: string;
    password?: string;
}

export interface LoginData {
    email: string;
    password?: string;
}

export interface VerifyCodeData {
    email: string;
    code: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    token: string;
    password: string;
}