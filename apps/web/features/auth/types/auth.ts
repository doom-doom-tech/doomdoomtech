export interface LoginRequest {
	email: string
	password: string
}

export interface RegistrationRequest {
	email: string
	terms: boolean
	username: string
	password: string
	newsletter: boolean
	password_confirmation: string
}

export interface ForgotPasswordRequest {
	email: string
}

export interface ResetPasswordRequest {
	email: string
	token: string
	password: string
	passwordConfirmation: string
}

export type SocialLoginPlatform = 'google' | 'apple'

export interface SocialLoginRequest {
	platform: SocialLoginPlatform
	firstName: string
	lastName: string
	token?: string
	avatar_url: string
	email: string
}

export interface VerifyEmailRequest {
	email: string
	token: string
}