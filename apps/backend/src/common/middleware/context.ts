import {Context} from "../utils/context";
import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import _ from "lodash";
import {container} from "../utils/tsyringe";
import {IUserService} from "../../features/user/services/UserService";

const ContextHandler = (req: Request, res: Response, next: NextFunction) => {
    Context.run(async () => {
        const userService = container.resolve<IUserService>("UserService")

        const token = req.headers["authorization"];

        let authID = 0;
        let user = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);

                authID = _.toNumber(decoded);
            } catch (error) {
                authID = 0;
            }
        }

        if (authID) {
            user = await userService.find({
                userID: authID, authID
            });
        }

        // Store in Context
        Context.set("authID", authID);
        Context.set("user", user);

        next();
    });
};

export default ContextHandler