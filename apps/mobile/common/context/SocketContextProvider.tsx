import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DEFAULT_SOCKET_CONFIG, WithChildren } from "@/common/types/common";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";
import { API_BASE_URL } from "../services/api";

interface SocketContextProviderProps extends WithChildren { }

const SocketContext = createContext<Socket | null>(null);

const SocketContextProvider = ({ children }: SocketContextProviderProps) => {

	const user = useGlobalUserContext();
	const [socket, setSocket] = useState<Socket | null>(null);
	const socketRef = useRef<Socket | null>(null);

	const handleInitializeSocket = useCallback(async () => {
		if (socketRef.current?.connected) {
			return;
		}

		if (socketRef.current && !socketRef.current.connected) {
			socketRef.current.removeAllListeners();
			socketRef.current.close();
		}

		const token = await AsyncStorage.getItem('Auth.accessToken');
		const userID = String(user?.getID() ?? 0);

		const newSocket = io(API_BASE_URL, {
			auth: { token },
			transports: ['websocket', 'polling'],
			extraHeaders: { user: userID },
			reconnection: DEFAULT_SOCKET_CONFIG.reconnection,
			reconnectionAttempts: DEFAULT_SOCKET_CONFIG.reconnectionAttempts,
			reconnectionDelay: DEFAULT_SOCKET_CONFIG.reconnectionDelay,
			timeout: DEFAULT_SOCKET_CONFIG.timeout
		});

		socketRef.current = newSocket;
		setSocket(newSocket);
	}, [user]);

	useEffect(() => {
		handleInitializeSocket();

		return () => {
			if (socketRef.current) {
				socketRef.current.removeAllListeners();
				socketRef.current.disconnect();
				socketRef.current = null;
			}
		};
	}, [handleInitializeSocket])

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const useSocketEvent = (event: string, handler: (...args: any[]) => void) => {
	const socket = useSocketContext();

	useEffect(() => {
		if (!socket) return;

		socket.on(event, handler);

		return () => {
			socket.off(event, handler);
		};
	}, [socket, event, handler]);
};

export default SocketContextProvider;
