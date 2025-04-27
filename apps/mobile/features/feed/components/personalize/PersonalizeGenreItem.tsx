import {StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native'
import {useCallback, useEffect, useMemo} from "react";
import Text from "@/common/components/Text";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {usePersonalizeStoreSelectors} from "@/features/feed/store/personalize";
import {palette} from "@/theme";
import {ImageBackground} from "expo-image";
import _ from 'lodash';

interface PersonalizeGenreItemProps {
    genre: { id: number, image: string, title: string }
}

const PersonalizeGenreItem = ({genre}: PersonalizeGenreItemProps) => {

    const {width} = useWindowDimensions()

    const opacity = useSharedValue(0.5)

    const selected = usePersonalizeStoreSelectors.genres()
    const setPersonalizeState = usePersonalizeStoreSelectors.setState()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {},
            image: {
                ...StyleSheet.absoluteFillObject,
                width: width, height: 80
            },
            name: {
                fontSize: 24,
                color: palette.offwhite
            }
        })
    }, []);

    const animatedItemStyle = useAnimatedStyle(() => ({
        width: width,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        opacity: opacity.value,
        backgroundColor: 'red'
    }))

    const handleSelect = useCallback(() => {
        if(_.some(selected, g => g === genre.id)) return setPersonalizeState({ genres: _.reject(selected, g => g === genre.id) })
        setPersonalizeState({ genres: [...selected, genre.id] })
    }, [genre, selected])

    useEffect(() => {
        opacity.value = withTiming(_.some(selected, g => g === genre.id) ? 1 : 0.5)
    }, [selected]);

    return (
        <TouchableOpacity onPress={handleSelect}>
            <Animated.View style={animatedItemStyle}>
                <ImageBackground source={genre.image} style={styles.image} />
                <Text style={styles.name}>
                    {genre.title}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    )
}

export default PersonalizeGenreItem