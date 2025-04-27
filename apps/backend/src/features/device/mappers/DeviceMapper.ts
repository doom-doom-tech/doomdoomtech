import {singleton} from "tsyringe";
import {Prisma} from "@prisma/client";
import {DeviceInterface} from "../types";
import _ from "lodash";


export type SelectableDeviceFields = Prisma.DeviceGetPayload<{
    select: ReturnType<typeof DeviceMapper.getSelectableFields>
}>;

@singleton()
class DeviceMapper {
    public static getSelectableFields(): Prisma.DeviceSelect {
        return {
            expo_device_id: true,
            device_token: true,
            push_token: true,
            platform: true
        }
    }

    public static format(devices: Array<SelectableDeviceFields>): Array<DeviceInterface> {
        return _.map(devices, device => ({
            expo_device_id: device.expo_device_id ?? null,
            device_token: device.device_token ?? null,
            push_token: device.push_token ?? null,
            platform: device.platform ?? null
        }));
    }
}

export default DeviceMapper