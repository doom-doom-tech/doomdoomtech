import "reflect-metadata";
import express from "express";
import path from 'path';
import http from 'http';
import cors from "cors";
import {Server} from "socket.io";
import mailchimp from '@mailchimp/mailchimp_marketing';
import SocketManager from "./common/services/SocketManager";
import {autoRegisterServices, container} from "./common/utils/tsyringe";
import {IMainRouter} from "./common/routes";
import Cachable from "./common/classes/cache/Cachable";
import {RefreshSession} from "./features/session/middleware/RefreshSession";
import QueueWorkerManager from "./common/queues/QueueWorkerManager";
import {CronJobService} from "./common/services/CronjobService";
import prisma from "./common/utils/prisma";
import {Context} from "./common/utils/context";
import {UserInterface} from "./features/user/types";
import {INotificationService} from "./features/notification/services/NotificationService";

require('dotenv').config()

process.on('unhandledRejection', (reason: any, promise) => {
    console.error('Unhandled Rejection at:', promise);

    let errorInfo = 'Unknown location';
    let errorMessage = 'Unknown error';
    let errorStack = '';

    if (reason && typeof reason === 'object') {
        // Check for custom error properties
        if (reason.data && reason.data.message) {
            errorMessage = reason.data.message;
        } else if (reason.message) {
            errorMessage = reason.message;
        }

        // Try to get the stack trace
        if (reason.stack) {
            errorStack = reason.stack;
            const stackLines = errorStack.split('\n');
            // Look for the first line in the stack that refers to your code
            const relevantLine = stackLines.find(line => line.includes('/Sites/doomdoomtech-api/'));

            if (relevantLine) {
                // Extract file path and line number using regex
                const match = relevantLine.match(/(\S+\.js):(\d+):(\d+)/);
                if (match) {
                    const [, filePath, lineNumber, columnNumber] = match;
                    errorInfo = `File: ${filePath}, Line: ${lineNumber}, Column: ${columnNumber}`;
                }
            }
        }
    } else {
        errorMessage = String(reason);
    }

    console.error('Error Message:', errorMessage);
    console.error('Location:', errorInfo);
    if (errorStack) {
        console.error('Stack Trace:');
        console.error(errorStack);
    }
});

export const ROOTDIR = __dirname;

const PORT = 8080;

let server: http.Server | undefined;
let queueWorkerManager: QueueWorkerManager;

async function bootstrap() {
    try {
        await autoRegisterServices();

        const app = express();
        server = http.createServer(app);

        app.set("trust proxy", "loopback");

        app.use(
            cors({
                origin: "*",
                exposedHeaders: ["x-session-id"],
                credentials: true,
                allowedHeaders: ["x-session-id", "x-device-id", "authorization", "content-type"],
            })
        );

        app.use(RefreshSession);

        app.use(express.static(path.join(__dirname, "public")));
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }));

        const io = new Server(server, { cors: { origin: "*" } });
        io.on("connection", (socket) => console.log(`Socket connected: ${socket.id}`));

        container.registerInstance<Server>("SocketIO", io);
        container.resolve(SocketManager);

        await Cachable.deleteMany([
            "user:*",
            "lists:*",
            "notes:*",
            "users:*",
            "tracks:*",
            "replies:*",
            "comments:*",
        ]);

        if (process.env.ENVIRONMENT === "production") {
            queueWorkerManager = container.resolve<QueueWorkerManager>("QueueWorkerManager");
            await queueWorkerManager.initialize();
        }

        const mainRouter = container.resolve<IMainRouter>("MainRouter");
        app.use("/", mainRouter.getRouter());

        const cronJobService = container.resolve(CronJobService);
        cronJobService.scheduleJobs();

        server.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is listening on port ${PORT}`);
        });

        mailchimp.setConfig({
            apiKey: "f1cb2c553f196d0caec92ac9b081f2f4-us12",
            server: "us12",
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    }
}

const shutdown = async () => {
    console.log("Shutting down...");
    try {
        if (server) {
            await new Promise<void>((resolve) => server && server.close(() => resolve()));
            console.log("HTTP server closed.");
        } else {
            console.log("No HTTP server to close.");
        }

        const cronJobService = container.resolve(CronJobService);
        cronJobService.stopAllJobs();

        if (queueWorkerManager) {
            await queueWorkerManager.shutdown();
        } else {
            console.log("No queueWorkerManager to shut down.");
        }
    } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

bootstrap().catch((error) => {
    console.error("Failed to bootstrap the application:", error);
    process.exit(1);
});
