import {UserInterface} from "@/features/user/types";

export default abstract class BaseUser<T extends UserInterface> {

    protected constructor(protected readonly data: T) {
        this.data = data
    }

    abstract getUUID(): string
    abstract getUsername(): string
    abstract verified(): boolean
    abstract following(): boolean
}