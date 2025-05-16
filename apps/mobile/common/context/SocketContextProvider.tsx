import AsyncStorage from "@react-native-async-storage/async-storage";
import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {DEFAULT_SOCKET_CONFIG, WithChildren} from "@/common/types/common";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

interface SocketContextProviderProps extends WithChildren {}

export const API_BASE_URL = process.env['EXPO_PUBLIC_SERVER_URL'];

const SocketContext = createContext<Socket | null>(null);

const SocketContextProvider = ({ children }: SocketContextProviderProps) => {

	const user = useGlobalUserContext();
	const [socket, setSocket] = useState<Socket | null>(null);
	const socketRef = useRef<Socket | null>(null);

	const handleInitializeSocket = useCallback(async () => {
		// If we already have a socket connection, don't create a new one
		if (socketRef.current?.connected) {
			return;
		}

		// Clean up existing socket if it exists but is not connected
		if (socketRef.current && !socketRef.current.connected) {
			socketRef.current.removeAllListeners();
			socketRef.current.close();
		}

		const token = await AsyncStorage.getItem('Auth.accessToken');
		const userID = String(user?.getID() ?? 0);

		const newSocket = io(API_BASE_URL, {
			auth: { token },
			transports: ['websocket', 'polling'],
			extraHeaders: {
				user: userID
			},
			reconnection: DEFAULT_SOCKET_CONFIG.reconnection,
			reconnectionAttempts: DEFAULT_SOCKET_CONFIG.reconnectionAttempts,
			reconnectionDelay: DEFAULT_SOCKET_CONFIG.reconnectionDelay,
			timeout: DEFAULT_SOCKET_CONFIG.timeout
		});

		// Setup reconnection event listeners
		newSocket.on('connect', () => {
			// console.log('Socket connected');
		});

		newSocket.on('disconnect', () => {
			// console.log('Socket disconnected');
		});

		newSocket.on('reconnect', (attemptNumber) => {
			// console.log(`Socket reconnected after ${attemptNumber} attempts`);
		});

		newSocket.on('reconnect_attempt', (attemptNumber) => {
			// console.log(`Socket reconnection attempt ${attemptNumber}`);
		});

		newSocket.on('reconnect_error', (error) => {
			// console.error('Socket reconnection error:', error);
		});

		newSocket.on('reconnect_failed', () => {
			// console.error('Socket reconnection failed');
			// Try to initialize a new socket after all reconnection attempts fail
			setTimeout(() => handleInitializeSocket(), DEFAULT_SOCKET_CONFIG.reconnectionDelay);
		});

		socketRef.current = newSocket;
		setSocket(newSocket);
	}, [user])


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
