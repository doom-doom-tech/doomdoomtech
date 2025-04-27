export interface LoginRequest {
	email: string
}

export interface RegistrationRequest {
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
	passwordConfirmation: string
}

export type SocialLoginPlatform = 'google' | 'apple'

export interface SocialLoginRequest {
	platform: SocialLoginPlatform
	firstName: string | null
	lastName: string  | null
	token?: string
	avatar_url: string | null
	email: string | null
}

export interface VerifyEmailRequest {
	email: string
	token: string
}