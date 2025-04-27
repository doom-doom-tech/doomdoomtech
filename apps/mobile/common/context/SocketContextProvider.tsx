import AsyncStorage from "@react-native-async-storage/async-storage";
import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {WithChildren} from "@/common/types/common";
import useGlobalUserContext from "@/features/user/hooks/useGlobalUserContext";

interface SocketContextProviderProps extends WithChildren {}

export const API_BASE_URL = process.env['EXPO_PUBLIC_SERVER_URL'];

const SocketContext = createContext<Socket | null>(null);

const SocketContextProvider = ({ children }: SocketContextProviderProps) => {

	const user = useGlobalUserContext();
	const [socket, setSocket] = useState<Socket | null>(null);

	const handleInitializeSocket = useCallback(async () => {
		const token = await AsyncStorage.getItem('Auth.accessToken');
		const userID = String(user?.getID() ?? 0);

		const newSocket = io(API_BASE_URL, {
			auth: { token },
			transports: ['websocket', 'polling'],
			extraHeaders: {
				user: userID
			}
		});

		setSocket(newSocket);
	}, [])


	useEffect(() => {
		handleInitializeSocket()

		return () => {
			socket?.disconnect();
		};
	}, [])

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export default SocketContextProvider;