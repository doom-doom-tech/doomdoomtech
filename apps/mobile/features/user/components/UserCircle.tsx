import {StyleSheet, View} from 'react-native'
import {useMemo} from "react";
import {palette} from "@/theme";
import _ from "lodash";
import Icon from "@/common/components/icon/Icon";
import {Image} from "expo-image";
import {CONFIG} from "@/common/constants";

interface UserCircleProps {
    source: Nullable<string>
    size: number
}

const UserCircle = ({source, size = 50}: UserCircleProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            circle :{
                width: size,
                height: size,
                overflow: 'hidden',
                borderRadius: size,
            },
            placeholder: {
                alignItems: 'center',
                justifyContent: 'center',
                width: size, height: size,
                backgroundColor: palette.lightgrey,
            },
            image: {
                width: size,
                height: size,
                objectFit: 'cover'
            }
        })
    }, []);

    if(_.isNull(source) || _.isUndefined(source) || _.isEmpty(source)) {
        return(
            <View style={styles.circle}>
                <View style={styles.placeholder}>
                    <Icon name={'user'} size={16} />
                </View>
            </View>
        )
    }

    return(
        <View style={styles.circle}>
            <Image source={source} style={styles.image} contentFit="cover" placeholder={{ blurhash: CONFIG.BLURHASH }} />
        </View>
    )
}

export default UserCircle