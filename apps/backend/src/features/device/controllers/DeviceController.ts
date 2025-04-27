import {IDeviceService} from "../services/DeviceService";
import {Request, Response} from "express";
import {Prisma} from "@prisma/client";
import {formatMutationResponse} from "../../../common/utils/responses";
import Controller from "../../../common/controllers/Controller";
import {container, singleton} from "tsyringe";
import {Context} from "../../../common/utils/context";

export interface IDeviceController {
	register(req: Request<any, any, Prisma.DeviceCreateInput>, res: Response): Promise<void>
}

@singleton()
class DeviceController extends Controller implements IDeviceController {

	constructor() {
		super();
	}

	public register = async (req: Request<any, any, Prisma.DeviceCreateInput>, res: Response) => {
		try {
			const deviceService = container.resolve<IDeviceService>("DeviceService");

			await deviceService.connect({
				...Context.get('authID') && { userID: Context.get('authID') },
				platform: req.body.platform,
				push_token: req.body.push_token,
				device_token: req.body.device_token,
				expo_device_id: req.body.expo_device_id,
			});

			res.status(200).json(formatMutationResponse("Device registered"));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}
}

DeviceController.register()