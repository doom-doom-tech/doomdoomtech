import {container} from "../../utils/tsyringe";
import Cachable from "../cache/Cachable";

export default class Instance extends Cachable {

    public static type = 'instance'

    static register<T extends new (...args: any[]) => any>(this: T, identifier?: string): void {
        container.register(identifier || this.name, { useClass: this });
    }
}