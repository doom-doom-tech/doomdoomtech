import {EncodedCursorInterface} from "../types/pagination";
import {Prisma} from "@prisma/client";
import {AuthenticatedRequest} from "../../features/auth/types/requests";

export interface FetchRankedListRequest extends AuthenticatedRequest, EncodedCursorInterface {
    userID?: number
    genreID?: number
    labelTag?: string
    subgenreID?: number
    period: 7 | 24 | 30 | 'infinite'
}

class RankedListService {

    public static getUserWhereClauses(data: Pick<FetchRankedListRequest, 'genreID' | 'subgenreID'>, blockedUsers: Array<number>): Prisma.UserWhereInput {
        return {
            ...(data.genreID === 200 || !data.genreID) ? {} : {
                tracks: {
                    some: {
                        track: {
                            genre: {
                                id: data.genreID
                            }
                        }
                    }
                }
            },
            ...(data.subgenreID === 200 || !data.subgenreID) ? {} : {
                tracks: {
                    some: {
                        track: {
                            subgenre: {
                                id: data.subgenreID
                            }
                        }
                    }
                }
            },
            NOT: {
                id: {
                    in: blockedUsers
                },
            },
        }
    }

    public static getTrackWhereClauses(data: Pick<FetchRankedListRequest, 'genreID' | 'subgenreID'>, blockedUsers: Array<number>): Prisma.TrackWhereInput {
        return {
            ...data.genreID === 200 ? {} : {
                genre: {
                    id: data.genreID
                }
            },
            ...data.subgenreID === 200 ? {} : {
                subgenre: {
                    id: data.subgenreID
                }
            },
            NOT: {
                artists: {
                    some: {
                        userID: {
                            in: blockedUsers
                        }
                    }
                },
            },
        }
    }
}

export default RankedListService