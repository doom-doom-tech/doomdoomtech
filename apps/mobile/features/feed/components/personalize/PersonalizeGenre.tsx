import {DeviceEventEmitter, LayoutChangeEvent, StyleSheet, useWindowDimensions, View} from 'react-native'
import {useCallback, useMemo, useState} from "react";
import Text from "@/common/components/Text";
import {palette, spacing} from "@/theme";
import Hiphop from "@/assets/images/personalize/hiphop.png"
import Dance from "@/assets/images/personalize/dance.png"
import Pop from "@/assets/images/personalize/pop.png"
import Beats from "@/assets/images/personalize/beats.png"
import Others from "@/assets/images/personalize/others.png"
import _ from 'lodash';
import PersonalizeGenreItem from "@/features/feed/components/personalize/PersonalizeGenreItem";
import Button from "@/common/components/buttons/Button";
import {router} from "expo-router";
import useFeedPersonalize from "@/features/feed/hooks/useFeedPersonalize";
import {usePersonalizeStoreSelectors} from "@/features/feed/store/personalize";

const PersonalizeGenre = () => {

    const { height } = useWindowDimensions()

    const setPersonalizeState = usePersonalizeStoreSelectors.setState()
    const selected = usePersonalizeStoreSelectors.genres()

    const personalizeMutation = useFeedPersonalize()

    const [offset, setOffset] = useState(0);

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: spacing.m,
                height: height - 100
            },
            title: {
                fontSize: 24,
                textAlign: 'center',
                color: palette.offwhite,
                fontWeight: 'bold'
            },
            items: {
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                paddingHorizontal: spacing.m,
                gap: spacing.m,
            },
        })
    }, []);

    const genres = useMemo(() => ([
        {
            id: 1,
            image: Dance,
            title: 'Dance'
        },
        {
            id: 2,
            image: Hiphop,
            title: 'Hiphop'
        },
        {
            id: 3,
            image: Beats,
            title: 'Beats & Instrumentals'
        },
        {
            id: 4,
            image: Pop,
            title: 'Pop'
        },
        {
            id: 5,
            image: Others,
            title: 'Others'
        },
    ]), [])

    const handleConfirm = useCallback(() => {
        // Mutate the events
        personalizeMutation.mutate({
            genres: selected
        })

        // Hide the banner
        setPersonalizeState({
            visible: false
        })

        DeviceEventEmitter.emit('personalize:scroll', 1)

        setTimeout(() => {
            DeviceEventEmitter.emit('personalize:scroll', 2)
        }, 5000)

        setTimeout(() => {
            router.back()
        }, 7500)
    }, [offset, selected])

    const handleLayoutComputation = useCallback((event: LayoutChangeEvent) => {
        setOffset(event.nativeEvent.layout.height)
    }, [])

    return(
        <View style={styles.wrapper} onLayout={handleLayoutComputation}>
            <Text style={styles.title}>
                Select your favorite genre
            </Text>
            <View style={styles.items}>
                { _.map(genres, (genre, __) => (
                    <PersonalizeGenreItem genre={genre} />
                ))}                
            </View>
            <View style={{ height: 50 }}>
                <Button label={"Confirm"} callback={handleConfirm} />
            </View>

        </View>
    )
}

export default PersonalizeGenre