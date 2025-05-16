import {StyleSheet, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import useUserLatest from "@/features/user/hooks/useUserLatest";
import List, {ListRenderItemPropsInterface} from "@/common/components/List";
import User from "@/features/user/classes/User";
import UserContextProvider from "@/features/user/context/UserContextProvider";
import UserTile from "@/features/user/components/user-tile/UserTile";
import _ from 'lodash';
import SingleUser from "@/features/user/classes/SingleUser";
import Button from "@/common/components/buttons/Button";
import useFollowMany from "@/features/follow/hooks/useFollowMany";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";
import {formatServerErrorResponse} from "@/common/services/utilities";
import {useQueryClient} from "@tanstack/react-query";
import {useActiveTrack} from "react-native-track-player";

interface FollowingFeedEmptyProps {
    onFollow: () => unknown
}

const FollowingFeedEmpty = ({onFollow}: FollowingFeedEmptyProps) => {
    const queryClient = useQueryClient()

    const current = useActiveTrack()

    const [loading, setLoading] = useState<boolean>(false)
    const [selected, setSelected] = useState<Array<User | SingleUser>>([]);

    const followManyMutation = useFollowMany()

    const latestArtistsQuery = useUserLatest({ period: 'infinite' })

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                flex: 1,
                position: 'relative'
            },
            title: {
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                color: palette.offwhite
            },
            subtitle: {
                fontSize: 16,
                fontWeight: 'regular',
                textAlign: 'center',
                color: palette.granite
            },
            container: {
                gap: spacing.m,
                padding: spacing.m,
                paddingBottom: 200
            },
            buttonWrapper: {
                width: '100%',
                height: 120,
                bottom: 90,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
            },
            blurView: {
                ...StyleSheet.absoluteFillObject,
            },
            gradientOverlay: {
                ...StyleSheet.absoluteFillObject,
            },
            buttonContainer: {
                position: 'absolute',
                width: '100%',
                alignItems: 'center',
                bottom: current ? 100 : 20,
            }
        })
    }, [current]);

    const userSelected = useCallback((user: User | SingleUser) => {
        return _.some(selected, u => u.getID() === user.getID())
    }, [selected])

    const handleSelectUser = useCallback((user: User | SingleUser) => {
        if(userSelected(user)) return setSelected(previous => _.reject(selected, u => u.getID() === user.getID()))
        setSelected(previous => [...previous, user])
    }, [selected, userSelected])

    const renderItem = useCallback(({item, index}: ListRenderItemPropsInterface<User>) => (
        <UserContextProvider user={item} key={item.getID()}>
            <UserTile
                selectable
                selected={_.some(selected, u => u.getID() === item.getID())}
                onSelect={handleSelectUser}
            />
        </UserContextProvider>
    ), [selected, handleSelectUser, userSelected])

    const handleFollowUsers = useCallback(async () => {
        try {
            setLoading(true)
            await followManyMutation.mutateAsync({
                users: _.map(selected, u => u.getID())
            })

            await queryClient.invalidateQueries({queryKey: ['feed', 'following'] })

            onFollow()
        } catch (error: any) {
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error)
        } finally {
            setLoading(false)
        }
    }, [selected, onFollow])

    return(
        <View style={styles.wrapper}>
            <Text style={styles.title}>
                Follow these artists
            </Text>
            <Text style={styles.subtitle}>
                Fresh new talent to enhance your feed
            </Text>
            <View style={{ flex: 1 }}>
                <List
                    <User>
                    infinite
                    numColumns={2}
                    renderItem={renderItem}
                    query={latestArtistsQuery}
                    contentContainerStyle={styles.container}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                />
            </View>

            { selected.length > 0 && (
                <View style={styles.buttonWrapper}>
                    <View style={styles.buttonContainer}>
                        <Button
                            loading={loading}
                            label={`Follow(${selected.length})`}
                            callback={handleFollowUsers}
                        />
                    </View>
                </View>
            )}

        </View>
    )
}

export default FollowingFeedEmpty