import {StyleSheet, Text, View} from 'react-native'
import {useCallback, useMemo} from "react";
import Genre from "@/features/genre/classes/Genre";
import _ from 'lodash';
import {palette, spacing} from "@/theme";
import UploadGenreButton from "@/features/upload/components/upload-genres/UploadGenreButton";

interface UploadGenreGroupProps {
    genre: Genre
}

const UploadGenreGroup = ({genre}: UploadGenreGroupProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                gap: 50
            },
            item: {
                alignItems: 'center',
                gap: spacing.m
            },
            title: {
                textAlign: 'center',
                color: palette.offwhite
            },
            genre: {
                fontSize: 18,
                fontWeight: 800,
                color: palette.granite
            },
            subgenre: {
                fontSize: 18,
                fontWeight: 800,
                color: palette.offwhite
            },
            genreButtons: {
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: spacing.s
            },
            divider: {
                height: 50
            }
        })
    }, []);

    const groupedSubgenres = useMemo(() => {
        return _.groupBy(genre.getSubgenres(), 'group')
    }, [])

    const getGroupedSubgenres = useCallback((group: string) => {
        return _.filter(genre.getSubgenres(), subgenre => subgenre.group === group)
    }, [])

    return(
        <View>
            <View style={styles.wrapper}>
                { _.map(_.keys(groupedSubgenres), group => (
                    <View style={styles.item}>
                        <Text style={styles.title}>
                            <Text style={styles.genre}>
                                {genre.getName().concat(' / ')}
                            </Text>
                            <Text style={styles.subgenre}>
                                {group}
                            </Text>
                        </Text>
                        <View style={styles.genreButtons}>
                            { _.map(getGroupedSubgenres(group), genre => (
                                <UploadGenreButton subgenre={genre} />
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}

export default UploadGenreGroup