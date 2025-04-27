import { DeviceEventEmitter } from 'react-native'
import { useEffect } from 'react'

const useEventListener = (event: string, callback: (...args: any[]) => unknown) => {
    useEffect(() => {
        const listener = DeviceEventEmitter.addListener(event, callback)
        return () => listener.remove()
    }, [event, callback])
}

export default useEventListener