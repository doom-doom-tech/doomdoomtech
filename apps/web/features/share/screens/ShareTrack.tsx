// @/pages/share.tsx
import {StyleSheet, useWindowDimensions, View} from "react-native";
import {useEffect, useMemo, useState} from "react";
import {router, useLocalSearchParams} from "expo-router";
import Screen from "@/common/components/Screen";
import MetaData from "@/common/components/MetaData";
import ShareContent from "@/features/share/components/ShareContent";
import Logo from "@/assets/icons/Logo";

const ShareTrack = () => {

    const { height } = useWindowDimensions();
    const params = useLocalSearchParams<any>();

    // Fallback for static export: Parse query params client-side
    const [queryParams, setQueryParams] = useState({
        id: "",
        title: "",
        artist: "",
        image: "",
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            setQueryParams({
                id: urlParams.get("id") || "",
                title: urlParams.get("title") || "",
                artist: urlParams.get("artist") || "",
                image: urlParams.get("image") || "",
            });
        }
    }, []);

    // Use params from useLocalSearchParams if available (dynamic), otherwise fallback to queryParams (static)
    const { id, title, artist, image } = Object.keys(params).length
        ? params
        : queryParams;

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {
                height: height || "100vh",
                justifyContent: "center",
                alignItems: "center",
            },
            logo: {
                position: "absolute",
                top: 50,
            },
        });
    }, [height]);

    return (
        <Screen>
            <View style={styles.wrapper}>
                <Logo width={150} style={styles.logo} onPress={() => router.push("/")} />
                <MetaData
                    title={`${artist} - ${title}`}
                    image={image}
                    url={`https://doomdoom.tech/share?artist=${encodeURIComponent(
                        artist
                    )}&title=${encodeURIComponent(title)}&image=${encodeURIComponent(
                        image
                    )}`}
                />
                <ShareContent {...{ id, title, artist, image }} />
            </View>
        </Screen>
    );
};

export default ShareTrack;