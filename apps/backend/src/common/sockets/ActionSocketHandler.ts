import {extractAuthIDFromBearer} from "../utils/utilities";
import {IMessageService} from "../../features/conversation/services/MessageService";
import {NOTIFYLIST} from "../constants/DMS";
import SocketHandler from "./SocketHandler";
import {inject, injectable} from "tsyringe";
import {INotificationService} from "../../features/notification/services/NotificationService";
import {DDT_ACCOUNT_ID} from "../constants";

@injectable()
class ActionSocketHandler extends SocketHandler {

    constructor(
        @inject("MessageService") private readonly messageService: IMessageService,
        @inject("NotificationService") private readonly notificationService: INotificationService
    ) { super() }

    protected registerEvents() {
        this.socket.on('action', this.handleAction);
    }

    private handleAction = async (data: { action: string; value: any }) => {
        if (data.action === "app-opened" && data.value === 2) {
            const userID = await extractAuthIDFromBearer(this.socket.handshake.auth.token);

            await this.notificationService.send({
                entityID: 0,
                action: "Info",
                targetID: userID,
                body: NOTIFYLIST,
                entityType: "Message",
                userID: DDT_ACCOUNT_ID,
                title: "Create your DDTop 10!",
                data: { "url" : "/conversations" },
            })

            await this.messageService.send({
                entityID: 0,
                type: "Text",
                targetID: userID,
                conversationID: 0,
                content: NOTIFYLIST,
                senderID: DDT_ACCOUNT_ID,
            });
        }
    }
}