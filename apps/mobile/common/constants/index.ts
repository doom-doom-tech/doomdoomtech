import Toast, {ToastOptions} from "react-native-root-toast";
import {palette, spacing} from "@/theme";

const CORE_TOAST_CONFIG: Partial<ToastOptions> = {
    duration: Toast.durations.LONG,
    shadow: false,
    textColor: palette['black'],
    opacity: 1,
    textStyle: {
        fontSize: 12,
    },
    containerStyle: {
        paddingVertical: spacing.m,
        paddingHorizontal: 50,
        borderRadius: 8,
        transform: [{ translateY: -100 }]
    }
}

export const TOASTCONFIG: Record<'success' | 'error' | 'warning', ToastOptions> = {
    success: {
        ...CORE_TOAST_CONFIG,
        backgroundColor: palette['olive'],
    },
    error: {
        ...CORE_TOAST_CONFIG,
        backgroundColor: palette.error,
    },
    warning: {
        ...CORE_TOAST_CONFIG,
        backgroundColor: palette['rose'],
    }
}

export const CONFIG = {
    FILESIZE: 200000000,
    STREAM_THRESHOLD: 30,
    BLURHASH: 'L36%Qqj[fQj[}SjtfQjtsnfQfQfQ',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
}
