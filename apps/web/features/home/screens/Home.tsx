import {StyleSheet, useWindowDimensions, View} from 'react-native'
import {useMemo} from "react";
import Logo from "@/assets/icons/Logo";
import Screen from "@/common/components/Screen";
import {Link} from "expo-router";
import Appstore from "@/assets/images/appstore.png"
import Playstore from "@/assets/images/playstore.png"
import {Image} from "expo-image";

interface HomeProps {

}

const Home = ({}: HomeProps) => {

    const { width, height } = useWindowDimensions()

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                height: height || '100vh',
                paddingVertical: 50,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center'
            },
            image: {
                width: 180,
                height: 60,
            },
            buttons: {
                flexDirection: 'column',
                gap: 8
            },
            logo: {
                position: 'absolute',
                top: 50,
            }
        })
    }, []);

    return(
        <Screen>
            <View style={styles.wrapper}>
                <Logo width={150} fill={'white'} style={styles.logo} />

                <View style={styles.buttons}>
                    <Link href={'https://apps.apple.com/nl/app/doomdoomtech/id6673906708?l=en-GB'}>
                        <Image source={Appstore} style={styles.image} />
                    </Link>
                    <Link href={'https://play.google.com/store/apps/details?id=app.doomdoom.tech&pcampaignid=web_share'}>
                        <Image source={Playstore} style={styles.image} />
                    </Link>
                </View>
            </View>
        </Screen>
    )
}

export default Home