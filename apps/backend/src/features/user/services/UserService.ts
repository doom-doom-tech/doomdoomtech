import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {Prisma} from "@prisma/client";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import {inject, singleton} from "tsyringe";
import {SelectableUserFields, UserMapper} from "../mappers/UserMapper";
import {SingleUserMapper} from "../mappers/SingleUserMapper";
import {TrackMapper} from "../../track/mappers/TrackMapper";
import {IUserBlockService} from "./UserBlockService";
import {FetchRankedListRequest} from "../../../common/services/RankedListService";
import Service, {IServiceInterface} from "../../../common/services/Service";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import {SingleUserInterface, UserInterface} from "../types";
import {CreateUserRequest, FetchLabelsRequest, FindUserRequest, FindUserTracksRequest, UpdateUserSocialsRequest, UserIDRequest} from "../types/requests";
import {TrackInterface} from "../../track/types";
import {SearchRequestInterface} from "../../search/types/requests";
import {AuthenticatedRequest} from "../../auth/types/requests";
import ValidationError from "../../../common/classes/errors/ValidationError";
import {container} from "../../../common/utils/tsyringe";
import {Context} from "../../../common/utils/context";

export interface IUserService extends IServiceInterface {
    lastActive(authID: number): Promise<void>
    delete(data: AuthenticatedRequest): Promise<void>
    find(data: FindUserRequest): Promise<SingleUserInterface>;
    labels(data: FetchLabelsRequest):  Promise<PaginationResult<UserInterface>>
    update(data: Prisma.UserUpdateArgs): Promise<void>;
    updateSocials(data: UpdateUserSocialsRequest): Promise<void>;
    tracks(data: FindUserTracksRequest): Promise<Array<TrackInterface>>
    create(data: CreateUserRequest): Promise<SingleUserInterface>
    search(data: SearchRequestInterface): Promise<PaginationResult<UserInterface>>
    suggested(data: EncodedCursorInterface): Promise<PaginationResult<UserInterface>>
    popular(data: any): Promise<PaginationResult<UserInterface>>
    latest(data: FetchRankedListRequest): Promise<PaginationResult<UserInterface>>
    resolve<Field extends keyof Prisma.UserWhereInput>(field: Field, value: Prisma.UserWhereInput[Field]): Promise<number>
}

@singleton()
class UserService extends Service implements IUserService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient,
        @inject("UserBlockService") private userBlockService: IUserBlockService
    ) {
        super()
    }

    public find = async (data: FindUserRequest) => {
        const userBlockService = container.resolve<IUserBlockService>("UserBlockService")

        console.log(data)

	    const user = await this.db.user.findFirst({
		    where: {
                id: data.userID,
                AND: [
                    {
                        NOT: {
                            id: {
                                in: await userBlockService.getBlockedUsers(data)
                            }
                        }
                    }
                ]
            },
		    select: {
                ...SingleUserMapper.getSelectableFields(),
                settings: data.userID === data.authID,
            }
	    })

	    if (!user) throw new EntityNotFoundError("User");

	    return await this.withCache(
		    `users:${data.userID}`,
		    async () => SingleUserMapper.format(user)
	    )
    }

    public delete = async (data: AuthenticatedRequest) => {
        await this.db.user.deleteMany({
            where: {
                id: data.authID
            }
        })
    }

    public tracks = async (data: FindUserTracksRequest): Promise<TrackInterface[]> => {
        return this.withCache(
            `users:${data.userID}:tracks`,
            async () => {
                return TrackMapper.formatMany(
                    await this.db.track.findMany({
                        select: TrackMapper.getSelectableFields(),
                        where: {
                            artists: {
                                some: {
                                    userID: data.userID
                                }
                            }
                        }
                    })
                );
            }
        );
    };

    public labels = async (data: FetchLabelsRequest) => {
        const response = await PaginationHandler.paginate<EncodedCursorInterface, any>({
            fetchFunction: async (params) => await this.db.user.paginate({
                orderBy: {created: 'desc'},
                select: UserMapper.getSelectableFields(),
                where: {
                    label: true,
                    username: {
                        not: 'Unauthenticated'
                    }
                },
            }).withCursor(params),
            data: data,
            pageSize: 10
        })

        return {
            ...response,
            data: UserMapper.formatMany(response.data)
        }
    }

    public lastActive = async (authID: number) => {
        await this.db.userActivity.upsert({
            where: {
                userID: authID
            },
            create: {
                userID: authID,
                last_active: new Date()
            },
            update: {
                last_active: new Date()
            }
        })
    }

    public create = async (data: CreateUserRequest) => {
        const existing = await this.db.user.findUnique({
            where: {email: data.email}
        });

        if (existing) throw new ValidationError("Email already taken");

        const user = await this.db.user.create({
            data: {
                username: data.username,
                email: data.email,
                label: false,
            },
            select: SingleUserMapper.getSelectableFields()
        });

        return this.withCache(
            `users:${user.id}`,
            async () => SingleUserMapper.format(user)
        );
    }

    public update = async (data: Prisma.UserUpdateArgs) => {
        await this.db.user.update(data)
        await this.deleteFromCache(`users:${data.data.id}`)
    }

    public updateSocials = async (data: UpdateUserSocialsRequest) => {
        for (let social of data.socials) {
            if (social.url === '') {
                await this.db.socialPlatform.delete({
                    where: {
                        userID_type: {
                            userID: data.authID, type: social.type
                        }
                    }
                })
            } else {
                await this.db.socialPlatform.upsert({
                    where: {social: {userID: data.authID, type: social.type}},
                    update: social,
                    create: {...social, userID: data.authID}
                })
            }
        }

        await this.deleteFromCache(`users:${data.authID}`)
    }

    public search = async (data: SearchRequestInterface) => {
        const words = data.query.split(' ');

        const searchConditions = words.map(word => ({
            OR: [
                {username: {contains: word, mode: 'insensitive' as Prisma.QueryMode}},
                {email: {contains: word, mode: 'insensitive' as Prisma.QueryMode}}
            ]
        }));

        const config = {
            select: UserMapper.getSelectableFields(),
            where: {
                NOT: {
                    username: 'Unauthenticated'
                },
                AND: [
                    {OR: searchConditions},
                    {NOT: {id: {in: await this.userBlockService.getBlockedUsers(data)}}}
                ],
            } as Prisma.UserWhereInput
        };

        const response = await PaginationHandler.paginate<EncodedCursorInterface, SelectableUserFields>({
            fetchFunction: async (params) => await this.db.user.paginate(config).withCursor(params),
            data: data,
            pageSize: 10
        });

        const formattedUsers = UserMapper.formatMany(response.data);

        return {
            ...response,
            data: formattedUsers
        };
    };

    public suggested = async (data: UserIDRequest & EncodedCursorInterface) => {

        const authID = Context.get('authID')

        const followingIDs = (await this.db.follow.findMany({
            where: { userID: authID },
            select: { followsID: true }
        })).map(f => f.followsID)

        const response = await PaginationHandler.paginate<EncodedCursorInterface, any>({
            fetchFunction: async (params) => await this.db.user.paginate({
                select: UserMapper.getSelectableFields(),
                where: {
                    // Exclude current user and users they're already following
                    id: { notIn: [authID, ...followingIDs] },
                    deleted: false,
                    OR: [
                        // 1. Users followed by the same people who follow the current user
                        {
                            followers: {
                                some: {
                                    user: {
                                        following: {
                                            some: {
                                                followsID: authID
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        // 2. Users that the same users (that userId follows) also follow
                        {
                            followers: {
                                some: {
                                    user: {
                                        followers: {
                                            some: {
                                                userID: authID
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        // 3. Users who have visited the current user's profile
                        {
                            visitors: {
                                some: {
                                    userID: authID
                                }
                            }
                        }
                    ]
                },
            }).withCursor(params),
            data: data,
            pageSize: 10
        });

        return {
            ...response,
            data: UserMapper.formatMany(response.data)
        };
    }

    public popular = async (data: FetchRankedListRequest) => {

        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const response = await PaginationHandler.paginate<EncodedCursorInterface, any>({
            fetchFunction: async (params) => await this.db.user.paginate({
                select: UserMapper.getSelectableFields(),
                where: {
                    NOT: {
                        id: {
                            in: await this.userBlockService.getBlockedUsers(data)
                        }
                    },
                    ...await this.formatAdditionalWhereClause(data),
                    tracks_count: {
                        gte: 1
                    },
                    followers: {
                        some: {
                            created: {
                                gte: oneDayAgo
                            }
                        }
                    },
                    username: {
                        not: 'Unauthenticated'
                    }
                },
                orderBy: {
                    followers: {
                        _count: 'desc'
                    }
                },
            }).withCursor(params),
            data: data,
            pageSize: 10
        });

        return {
            ...response,
            data: UserMapper.formatMany(response.data)
        };
    }

    public latest = async (data: FetchRankedListRequest) => {
        const response =  await PaginationHandler.paginate<EncodedCursorInterface, any>({
            fetchFunction: async (params) => await this.db.user.paginate({
                orderBy: {created: 'desc'},
                select: UserMapper.getSelectableFields(),
                where: {
                    NOT: {
                        id: {
                            in: await this.userBlockService.getBlockedUsers(data)
                        }
                    },
                    ...await this.formatAdditionalWhereClause(data),
                    avatar_url: {
                        not: null
                    },
                    label: false,
                    tracks_count: {
                        gte: 1
                    },
                    username: {
                        not: 'Unauthenticated'
                    }
                },
            }).withCursor(params),
            data: data,
            pageSize: 10
        })

        return {
            ...response,
            data: UserMapper.formatMany(response.data)
        }
    }

    public resolve = async <Field extends keyof Prisma.UserWhereInput>(field: Field, value: Prisma.UserWhereInput[Field]) => {
        if (!value) {
            throw new Error(`Value for field "${String(field)}" is required.`);
        }

        return await this.withCache(
            `users:${String(value)}:id`,
            async () => {
                const user = await this.db.user.findFirst({
                    where: {[field]: value},
                    select: {id: true},
                });
                if (!user) throw new EntityNotFoundError("User");
                return user.id;
            },
            {
                ttl: 60 * 60 * 24, // Cache for 24 hours
            }
        );
    };

    private async formatAdditionalWhereClause(data: FetchRankedListRequest): Promise<Prisma.UserWhereInput> {
        return {
            ...data.userID ? {} : {},
            ...data.genreID ? { tracks: { some: { track : { genreID: Number(data.genreID)}}}} : {},
            ...data.subgenreID ? { tracks: { some: { track : { subgenreID: Number(data.subgenreID)}}}} : {},
            ...data.labelTag ? { tracks: { some: { track: { tags: { some: {  user: { username: data.labelTag }}}}}}} : {},
        }
    }
}

UserService.register()