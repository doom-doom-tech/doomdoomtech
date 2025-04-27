export interface RegisterDeviceRequest {
	userID?: number
	platform?: "ios" | "android" | "windows" | "macos" | "web"
	push_token?: string
	device_token?: string
	expo_device_id: string
}