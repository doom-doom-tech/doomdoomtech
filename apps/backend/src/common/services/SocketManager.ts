import {Server, Socket} from "socket.io";
import {inject, injectable, singleton} from "tsyringe";
import {container} from "../utils/tsyringe";

export let socketInstance: SocketManager | null = null;

@singleton()
@injectable()
class SocketManager {

	private activeConnections: Map<string, Set<string>> = new Map();

	constructor(
		@inject("SocketIO") protected readonly  io: Server
	) {
		this.setupConnectionHandler();
		socketInstance = this;
	}

	public async emitToRoom(room: string, event: string, data: any) {
		try {
			this.io.to(room).emit(event, data);
		} catch (error) {
			console.error(`Error emitting to room [${room}]:`, error);
			await this.handleRoomError(room);
		}
	}

	public emitToAll(event: string, data: any): void {
		this.io.emit(event, data);
	}

	// Manage Room Connections
	private async addConnection(socket: Socket, room: string) {
		if (!this.activeConnections.has(socket.id)) {
			this.activeConnections.set(socket.id, new Set());
		}
		this.activeConnections.get(socket.id)?.add(room);
		await socket.join(room);
	}

	private async removeConnection(socket: Socket, room: string) {
		this.activeConnections.get(socket.id)?.delete(room);
		if (this.activeConnections.get(socket.id)?.size === 0) {
			this.activeConnections.delete(socket.id);
		}
		await socket.leave(room);
	}

	private cleanupSocketConnections(socket: Socket) {
		const rooms = this.activeConnections.get(socket.id);
		if (rooms) {
			rooms.forEach((room) => socket.leave(room));
		}
		this.activeConnections.delete(socket.id);
	}

	private async handleRoomError(room: string) {
		const socketsInRoom = await this.io.in(room).fetchSockets();
		socketsInRoom.forEach((socket) => socket.disconnect(true));
	}

	private setupConnectionHandler() {
		this.io.on("connection", (socket: Socket) => this.handleNewConnection(socket));
	}

	private async handleNewConnection(socket: Socket) {
		try {
			const userID = socket.handshake.headers.user as string;
			if (!userID) {
				throw new Error("User ID missing from handshake headers.");
			}

			const userRoom = `user_${userID}`;
			await this.addConnection(socket, userRoom);

			socket.on("disconnecting", async () => {
				await this.handleDisconnection(socket, userRoom);
			});

		} catch (error) {
			console.error("Error during socket connection:", error);
			socket.disconnect(true);
		}
	}

	private initializeHandlers(socket: Socket) {
		container.resolve("ActionSocketHandler")
	}

	private async handleDisconnection(socket: Socket, room: string) {
		try {
			this.cleanupSocketConnections(socket);
			await this.removeConnection(socket, room);
		} catch (error) {
			console.error("Error during socket disconnection:", error);
		}
	}
}

export default SocketManager;