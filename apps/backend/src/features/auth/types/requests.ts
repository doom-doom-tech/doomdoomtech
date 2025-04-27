export interface AuthenticatedRequest {
    authID: number
}

export interface LoginRequest {
    email: string
}

export interface VerifyAuthorizationCodeRequest {
    code: string
    email: string
}

export interface AuthorizeRequest {
    email: string
    code: string
}

export interface RegistrationRequestInterface {
    email: string
    label: boolean
    username: string
    code: string | null
    newsletter: boolean
}

export interface ForgotPasswordRequest {
    email: string
}

export interface ResetPasswordRequest {
    email: string
    token: string
    password: string
}

export interface DeletePasswordResetTokenRequest {
    email: string
}

export interface DeleteAuthorizationCodeRequest {
    email: string
}