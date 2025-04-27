export interface DeviceIDRequest {
    deviceID: string
}

export interface DeviceInterface {
    expo_device_id: string | null,
    device_token: string | null,
    push_token: string | null,
    platform: 'ios' | 'android' | null
}