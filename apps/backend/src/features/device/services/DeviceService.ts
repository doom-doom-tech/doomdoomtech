import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {Prisma} from "@prisma/client";
import Service from "../../../common/services/Service";
import {inject, singleton} from "tsyringe";
import DeviceMapper from "../mappers/DeviceMapper";
import {DeviceInterface} from "../types";
import {UserIDRequest} from "../../user/types/requests";

export interface IDeviceService {
    connect(data: Partial<Prisma.DeviceCreateInput> & { userID: number }): Promise<void>

    find(data: UserIDRequest): Promise<Array<DeviceInterface>>
}

@singleton()
class DeviceService extends Service implements IDeviceService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient
    ) {
        super()
    }

    public find = async (data: UserIDRequest) => {
        return this.withCache(
            `users:${data.userID}:devices`,
            async () => DeviceMapper.format(
                await this.db.device.findMany({
                    where: {userID: data.userID},
                    select: DeviceMapper.getSelectableFields()
                })
            )
        )
    }

    public connect = async (data: Partial<Prisma.DeviceCreateInput> & { userID: number }) => {
        const existingDevice = await this.db.device.findFirst({
            where: {
                OR: [
                    { expo_device_id: data.expo_device_id ?? undefined },
                    { device_token: data.device_token ?? undefined }
                ]
            }
        });

        if (existingDevice) {
            const shouldUpdate =
                existingDevice.userID !== data.userID ||
                existingDevice.push_token !== data.push_token ||
                existingDevice.platform !== data.platform;

            if (shouldUpdate) {
                await this.db.device.update({
                    where: {
                        id: existingDevice.id
                    },
                    data: {
                        expo_device_id: data.expo_device_id ?? existingDevice.expo_device_id,
                        push_token: data.push_token ?? existingDevice.push_token,
                        platform: data.platform ?? existingDevice.platform,
                        userID: data.userID
                    }
                });
            }
        } else {
            await this.db.device.create({
                data: {
                    expo_device_id: data.expo_device_id ?? '',
                    device_token: data.device_token,
                    push_token: data.push_token,
                    platform: data.platform,
                    userID: data.userID
                }
            });
        }
    };
}

DeviceService.register()
