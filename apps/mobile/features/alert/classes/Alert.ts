import {UserInterface} from "@/features/user/types";
import {AlertInterface} from "@/features/alert/types";

class Alert {

    private readonly data: AlertInterface

    constructor(data: AlertInterface) {
        this.data = data
    }

    public getEntity() {
        return this.data.entity
    }

    public getEvent() {
        return this.data.event
    }

    public getEntityType() {
        return this.data.entityType
    }

    public getAction() {
        return this.data.action
    }

    public getContent() {
        return this.data.content
    }

    public getCount(): number {
        return this.data.count
    }

    public getUsers(): Array<UserInterface> {
        return this.data.users
    }
}

export default Alert