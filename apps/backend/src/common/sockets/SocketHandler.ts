import {Socket} from "socket.io";

abstract class SocketHandler {
    protected socket!: Socket;

    handleSocket(socket: Socket) {
        this.socket = socket;
        this.setupListeners();
    }

    protected abstract registerEvents(): void;

    protected cleanupListeners = () => {
        this.socket.removeAllListeners();
    };

    private setupListeners() {
        this.registerEvents();
        this.socket.on('disconnect', this.cleanupListeners);
    }
}

export default SocketHandler;