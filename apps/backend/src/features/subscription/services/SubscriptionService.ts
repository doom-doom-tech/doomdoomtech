import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import Singleton from "../../../common/classes/injectables/Singleton";
import axios from "axios";
import _ from "lodash";
import {Context} from "../../../common/utils/context";

export interface ISubscriptionService {
    validateSubscriptionStatus(): Promise<void>
}

@singleton()
class SubscriptionService extends Singleton implements ISubscriptionService {

    constructor(
        @inject("Database") private db: ExtendedPrismaClient
    ) { super() }

    public async validateSubscriptionStatus() {
        const authID = Context.get('authID')

        const projectID = process.env.REVENUECAT_PROJECT_ID as string;
        const apiKEY = process.env.REVENUECAT_API_KEY as string;

        const response = await axios.get(`https://api.revenuecat.com/v2/projects/${projectID}/customers/${authID}`, {
            headers: { Authorization: `Bearer ${apiKEY}` },
        });

        if(!_.isEmpty(_.get(response, 'data.active_entitlements.items', []))) {
            await this.db.user.update({
                where: {
                    id: authID
                },
                data: {
                    premium: true
                }
            })
        }
    }
}

SubscriptionService.register()