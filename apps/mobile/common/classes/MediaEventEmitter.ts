import {DeviceEventEmitter, EmitterSubscription} from 'react-native';
import {MediaEvents} from "@/common/constants/events";

class MediaEventEmitter {
    static addListener<E extends keyof MediaEvents>(eventType: E, listener: (event: MediaEvents[E]) => void): EmitterSubscription {
        return DeviceEventEmitter.addListener(eventType, listener);
    }

    static emit<E extends keyof MediaEvents>(eventType: E, eventData: MediaEvents[E]): void {
        DeviceEventEmitter.emit(eventType as string, eventData);
    }

    static removeAllListeners<E extends keyof EventMap>(eventType: E): void {
        DeviceEventEmitter.removeAllListeners(eventType);
    }
}

export default MediaEventEmitter