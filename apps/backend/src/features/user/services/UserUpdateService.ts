import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import Service, {IServiceInterface} from "../../../common/services/Service";
import {UserInterface} from "../../user/types";
import {UserMapper} from "../mappers/UserMapper";

export interface UpdateSourceRequest {
    uuid: string;
    source: string;
}

export interface IUserUpdateService extends IServiceInterface {
    updateAvatarUrl(data: UpdateSourceRequest): Promise<UserInterface>;
    updateBannerUrl(data: UpdateSourceRequest): Promise<UserInterface>;
}

@singleton()
class UserUpdateService extends Service implements IUserUpdateService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient
    ) { super() }

    public async updateAvatarUrl(data: UpdateSourceRequest): Promise<UserInterface> {
        // Find the user
        const user = await this.db.user.findFirst({
            select: UserMapper.getSelectableFields(),
            where: {
                deleted: false,
                uuid: data.uuid
            }
        });

        if (!user) throw new EntityNotFoundError('User');

        // Update the user with the new avatar URL
        const updatedUser = await this.db.user.update({
            select: UserMapper.getSelectableFields(),
            where: {
                uuid: data.uuid
            },
            data: {
                avatar_url: data.source
            }
        });

        // Return the updated user
        return UserMapper.format(updatedUser);
    }

    public async updateBannerUrl(data: UpdateSourceRequest): Promise<UserInterface> {
        // Find the user
        const user = await this.db.user.findFirst({
            select: UserMapper.getSelectableFields(),
            where: {
                deleted: false,
                uuid: data.uuid
            }
        });

        if (!user) throw new EntityNotFoundError('User');

        // Update the user with the new banner URL
        const updatedUser = await this.db.user.update({
            select: UserMapper.getSelectableFields(),
            where: {
                uuid: data.uuid
            },
            data: {
                banner_url: data.source
            }
        });

        // Return the updated user
        return UserMapper.format(updatedUser);
    }
}

UserUpdateService.register();