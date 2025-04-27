import {FlatList, StyleSheet, useWindowDimensions, View} from 'react-native'
import {Fragment, useMemo, useRef} from "react";
import PersonalizeGenre from "@/features/feed/components/personalize/PersonalizeGenre";
import Header from "@/common/components/header/Header";
import PersonalizeProgress from "@/features/feed/components/personalize/PersonalizeProgress";
import useEventListener from "@/common/hooks/useEventListener";
import PersonalizeComplete from "@/features/feed/components/personalize/PersonalizeComplete";

interface personalizeProps {

}

const personalize = ({}: personalizeProps) => {

    const { height: screenHeight } = useWindowDimensions();

    const data = ['genre', 'progress', 'complete'];
    const flatListRef = useRef<FlatList>(null);

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    useEventListener('personalize:scroll', (offset: number) => {
        flatListRef.current && flatListRef.current.scrollToIndex({ index: offset, animated: true, viewOffset: -200 })
    })

    return(
        <View style={styles.wrapper}>
            <Header title={"Personalize"} />
            <FlatList
                ref={flatListRef}
                data={data}
                // scrollEnabled={false}
                snapToInterval={screenHeight} // Snap to each item's height
                decelerationRate="fast" // Smooth snapping
                renderItem={({ item }) => {
                    if (item === 'genre') return <PersonalizeGenre />;
                    if (item === 'progress') return <PersonalizeProgress />;
                    if (item === 'complete') return <PersonalizeComplete />;
                    return <Fragment />
                }}
                keyExtractor={(item) => item}
            />
        </View>
    )
}

export default personalize