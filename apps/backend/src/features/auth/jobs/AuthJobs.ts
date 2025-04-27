import prisma from "../../../common/utils/prisma";
import {inject, singleton} from "tsyringe";
import {DeletePasswordResetTokenRequest} from "../types/requests";
import {IAuthService} from "../services/AuthService";

@singleton()
class AuthJobs {

	constructor(@inject("AuthService") private authService: IAuthService) {}

	public deleteAuthorizationCodeJob = async (job: DeletePasswordResetTokenRequest) => {
		await this.authService.deleteAuthorizationCode(job)
	}

	public deleteVerificationTokenJob = async (job: { email: string }) => {
		await prisma.verifyEmailToken.delete({ where: { email: job.email } });
	}
}

export default AuthJobs