import {SingleUserInterface} from "@/features/user/types";


class SingleUser{

	constructor(protected readonly data: SingleUserInterface)
	{}

	public getID() {
		return this.data.id
	}

	public getUUID() {
		return this.data.uuid
	}

	public getBio() {
		return this.data.bio
	}

	public isLabel() {
		return this.data.label
	}

	public isPremium() {
		return this.data.premium
	}

	public getInviteCode() {
		return this.data.invite_code
	}

	public getCreditValue() {
		return this.data.credits
	}

	public getSocials() {
		return this.data.socials
	}

	public getTracksCount() {
		return this.data.tracks_count
	}

	public getUsername(): string {
		return this.data.username
	}

	public getImageSource() {
		return this.data.avatar_url
	}

	public getBannerSource() {
		return this.data.banner_url
	}

	public premium() {
		return this.data.premium
	}

	public verified() {
		return this.data.verified
	}

	public following() {
		return this.data.following
	}

	public getFollowersAmount() {
		return this.data.followers_count
	}

	public getFollowingAmount() {
		return this.data.following_count
	}

	public getSettings() {
		return this.data.settings
	}

	public serialize() {
		return this.data
	}
}

export default SingleUser