import {StyleSheet, TextStyle, useWindowDimensions, View} from 'react-native'
import _ from "lodash";
import {Fragment, ReactElement, useCallback, useMemo} from "react";
import {palette, spacing} from "@/theme";
import Animated, {FadeInRight, FadeOutLeft, runOnJS, useAnimatedStyle} from "react-native-reanimated";
import {useRouter} from "expo-router";
import {Directions, Gesture, GestureDetector} from "react-native-gesture-handler";
import UserCircle from "@/features/user/components/UserCircle";
import {pluralOrSingular} from "@/common/services/utilities";
import User from "@/features/user/classes/User";
import {TrackActivityInterface} from "@/features/track/types";
import Text from "@/common/components/Text";

interface MainFeedTrackStatisticProps {
	type: TrackActivityInterface['type']
	count: number
	users: Array<User>
	onFling: (...args: Array<any>) => unknown
}

const MainFeedTrackStatistic = ({type, count, users, onFling = _.noop}: MainFeedTrackStatisticProps) => {

	const {width} = useWindowDimensions()

	const styles = useMemo(() => {
		return StyleSheet.create({
			username: {
				color: palette.offwhite,
			},
			maintext: {
				fontSize: 14,
				color: palette.granite,
			},
			textWrapper: {
				display: 'flex',
				alignItems: 'center',
				width: width * 0.7,
				height: 16
			},
		})
	}, []);

	const router = useRouter()

	const handleRouteUser = useCallback((id: number) => () => {
	    router.push(`/user/${id}`)
	}, [])

	const PressableUserName = useCallback((user: User) => (
		<Text onPress={handleRouteUser(user.getID())} style={styles.username} key={user.getUUID()}>{user.getUsername()}</Text>
	), [handleRouteUser])

	const Usernames: ReactElement | Array<ReactElement> = useMemo(() => {
		if (_.size(users) === 1) return PressableUserName(_.nth(users, 0)!)

		if (_.size(users) === 2 && count === 2) {
			return (
				<Text style={styles.maintext as TextStyle}>
					{PressableUserName(_.nth(users, 0)!)}
					<Text style={styles.maintext} key={'__'}> and </Text>
					{PressableUserName(_.nth(users, 1)!)}
				</Text>
			)
		}

		if (_.size(users) === 2 && count > 2) {
			return (
				<Text style={styles.maintext as TextStyle}>
					{PressableUserName(_.nth(users, 0)!)}
					<Text style={styles.username} key={'__'}> ,</Text>
					{PressableUserName(_.nth(users, 1)!)}
				</Text>
			)
		}

		return <Fragment />
	}, [users, count])

	const UserCircles: Array<ReactElement> = useMemo(() => _.map(users, (user, index) =>
		<View style={{ marginLeft: index * -24 }} key={user.getUUID()}>
			<UserCircle size={32} source={user.getImageSource()}  />
		</View>
	), [])

	const MainText = useMemo(() => {
		let actionText: string, content: string

		const usersCount = _.size(users);
		const remainingCount = count - usersCount;

		switch (type) {
			case "list":
				actionText = `added this track to ${ usersCount === 1 ? 'the' : 'their' } top picks.`;
				break
			case "like":
				actionText = "rated this track.";
				break
		}

		switch (true) {
			case usersCount > 0 && remainingCount > 0:
				content = `and ${remainingCount} ${pluralOrSingular(remainingCount, 'user')} ${actionText}`;
				break
			case usersCount > 0 && remainingCount <= 0:
				content = actionText;
				break
			default:
				content = `${count} ${pluralOrSingular(count, 'user')} ${actionText}`
		}

		if (usersCount > 0) {
			if (remainingCount > 0) {
				content = `and ${remainingCount} ${pluralOrSingular(remainingCount, 'other')} ${actionText}`
			}
			if (remainingCount <= 0) {
				content = actionText
			}
		} else {
			content = `${count} ${pluralOrSingular(count, 'user')} ${actionText}`
		}

		return <Text style={styles.maintext as TextStyle}>{' ' + content}</Text>
	}, [styles, type, count, users])

	const animatedWrapperStyle = useAnimatedStyle(() => ({
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.s
	}))

	const fling = Gesture.Fling()
		.direction(Directions.LEFT)
		.onStart(context => runOnJS(onFling)())

	return (
		<GestureDetector gesture={fling}>
			<Animated.View style={animatedWrapperStyle} entering={FadeInRight.duration(100).delay(300)}
			               exiting={FadeOutLeft.duration(100)}>
				{!_.isEmpty(users) && UserCircles}
				<Text style={styles.textWrapper} numberOfLines={2}>
					{Usernames} {MainText}
				</Text>
			</Animated.View>
		</GestureDetector>
	)
}

export default MainFeedTrackStatistic