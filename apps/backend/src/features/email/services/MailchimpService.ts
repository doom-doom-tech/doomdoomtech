import mailchimp from "@mailchimp/mailchimp_marketing";
import Singleton from "../../../common/classes/injectables/Singleton";
import {singleton} from "tsyringe";

type EmailType = "text" | "html";

export type Status = "subscribed" | "unsubscribed" | "cleaned" | "pending" | "transactional";

export interface MailchimpSubscriber {
	email_address: string;
	email_type: EmailType;
	status: Status;
}

export const mailingLists = {
	newSubscribers: '02e63e8cde',
	newsLetter: '6b756bfb00'
}

export interface IMailchimpService {
	addSubscribersToList(listID: typeof mailingLists[keyof typeof mailingLists], members: Array<MailchimpSubscriber>): Promise<void>
}

@singleton()
class MailchimpService extends Singleton implements IMailchimpService {
	public async addSubscribersToList(listID: typeof mailingLists[keyof typeof mailingLists], members: Array<MailchimpSubscriber>): Promise<void> {
		try {
			await mailchimp.lists.batchListMembers(listID, {
				members: members,
				update_existing: true
			});
		} catch (error) {
			console.error('Error adding subscribers:', error);
			throw error;
		}
	}
}

MailchimpService.register()