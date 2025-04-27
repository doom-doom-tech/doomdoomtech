import {Router} from "express";
import {container} from "tsyringe";

export interface IBaseRouter {
    getRouter(): Router
}

export abstract class BaseRouter implements IBaseRouter {
    public router: Router;

    protected constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    // Register route class with tsyringe DI container
    static register<T extends new (...args: any[]) => any>(this: T, identifier?: string): void {
        container.register(identifier || this.name, { useClass: this });
    }

    // Provide a method to expose the router for Express app use
    public getRouter(): Router {
        return this.router;
    }

    // Abstract method to initialize routes in subclasses
    protected abstract initializeRoutes(): void;
}

export default BaseRouter;