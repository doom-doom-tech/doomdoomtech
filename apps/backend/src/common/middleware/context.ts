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

                if(typeof decoded === "string") {
                    authID = _.toNumber(decoded);
                } else {
                    authID = _.toNumber(decoded.userId);
                }
            } catch (error) {
                authID = 0;
            }
        }

        if (authID) {
            user = await userService.find({
                userID: authID, authID
            });
        }

        // if(_.isNaN(authID)) authID = 0;

        // Store in Context
        Context.set("authID", authID);
        Context.set("user", user);

        next();
    });
};

export default ContextHandler