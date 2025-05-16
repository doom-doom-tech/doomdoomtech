// @/pages/share.tsx
import {StyleSheet, useWindowDimensions, View} from "react-native";
import {useEffect, useMemo, useState} from "react";
import {router, useLocalSearchParams} from "expo-router";
import Screen from "@/common/components/Screen";
import MetaData from "@/common/components/MetaData";
import ShareContent from "@/features/share/components/ShareContent";
import Logo from "@/assets/icons/Logo";
import api from "@/common/services/api";

const ShareTrack = () => {

    const { height } = useWindowDimensions();
    const params = useLocalSearchParams<any>();

    const [queryParams, setQueryParams] = useState({
        id: "",
        title: "",
        artist: "",
        image: "",
    });

    const [trackData, setTrackData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchTrackData = async (trackId: string) => {
        try {
            setLoading(true);
            const response = await api.get(`/track/${trackId}`);
            const track = response.data.data.track;

            console.log(track)

            setTrackData({
                title: track.title,
                artist: track.artists[0].username,
                image: track.cover_url,
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching track data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            setQueryParams({
                id: urlParams.get("id") || params.id || "",
                title: urlParams.get("title") || "",
                artist: urlParams.get("artist") || "",
                image: urlParams.get("image") || "",
            });
        }
    }, []);

    // Fetch track data if we have an ID but no title/artist/image
    useEffect(() => {
        const paramId = params.id || queryParams.id;
        const hasParams = params.title || queryParams.title;

        if (paramId && !hasParams && !trackData && !loading) {
            fetchTrackData(paramId);
        }
    }, [params, queryParams]);

    // Use params from useLocalSearchParams if available (dynamic), otherwise fallback to queryParams (static)
    // If we have trackData from API, use that
    const { id, title, artist, image } = trackData 
        ? { id: params.id || queryParams.id, ...trackData }
        : Object.keys(params).length > 1
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

    console.log(trackData)

    return (
        <Screen>
            <View style={styles.wrapper}>
                <Logo width={150} style={styles.logo} onPress={() => router.push("/")} />
                {loading ? (
                    <MetaData
                        title="Loading track..."
                        description="Please wait while we load the track information."
                    />
                ) : (
                    <MetaData
                        title={`${artist} - ${title}`}
                        description={`Listen to ${title} by ${artist} on DoomDoomTech`}
                        image={image}
                        url={`https://doomdoom.tech/s/${id}`}
                        additionalMetaData={
                            <>
                                <meta property="og:image:width" content="1200" />
                                <meta property="og:image:height" content="630" />
                                <meta property="og:site_name" content="DoomDoomTech" />
                                <meta property="og:type" content="music.song" />
                                <meta property="music:musician" content={artist} />
                            </>
                        }
                    />
                )}
                <ShareContent id={Number(id)} title={title} artist={artist} image={image} />
            </View>
        </Screen>
    );
};

export default ShareTrack;
