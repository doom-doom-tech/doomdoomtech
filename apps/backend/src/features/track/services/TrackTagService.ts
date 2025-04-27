import Service, {IServiceInterface} from "../../../common/services/Service";
import {CreateTaggedTrackRequest} from "../types/requests";
import {container, singleton} from "tsyringe";
import {INotificationService} from "../../notification/services/NotificationService";
import {DDT_ACCOUNT_ID} from "../../../common/constants";
import {IUserService} from "../../user/services/UserService";
import {ITrackService} from "./TrackService";

export interface ITrackTagService extends IServiceInterface {
    create(data: CreateTaggedTrackRequest): Promise<void>
}

@singleton()
class TrackTagService extends Service implements ITrackTagService {
    public create = async (data: CreateTaggedTrackRequest) => {
        const userService = container.resolve<IUserService>("UserService");
        const trackService = container.resolve<ITrackService>("TrackService");
        const notificationService = container.resolve<INotificationService>("NotificationService");

        const label = await userService.find({
            userID: data.userID,
            authID: data.userID
        })

        const track = await trackService.find({
            trackID: data.trackID,
            authID: data.userID
        })

        await notificationService.send({
            action: 'Info',
            entityType: 'Track',
            body: "You have a new track in your label inbox",
            targetID: data.userID,
            userID: DDT_ACCOUNT_ID,
            title: 'New track',
            entityID: track.id,
            data: { "url": `/label/${label.username.toLowerCase()}/inbox` }
        });

        await this.db.taggedTrack.create({
            data
        })
    }
}

TrackTagService.register()