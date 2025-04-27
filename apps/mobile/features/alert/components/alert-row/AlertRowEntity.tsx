import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {useCallback, useMemo} from "react";
import {formatServerErrorResponse} from "@/common/services/utilities";
import {useAlertContext} from "@/features/alert/context/AlertContextProvider";
import {router} from "expo-router";
import Track from "@/features/track/classes/Track";
import {TrackInterface} from "@/features/track/types";
import _ from "lodash";
import FollowButton from "@/features/follow/components/FollowButton";
import User from "@/features/user/classes/User";
import TrackContextProvider from "@/features/track/context/TrackContextProvider";
import TrackCover from "@/features/track/components/TrackCover";
import {TOASTCONFIG} from "@/common/constants";
import Toast from "react-native-root-toast";
import useCollabAccept from "@/features/alert/hooks/useCollabAccept";
import useCollabDecline from "@/features/alert/hooks/useCollabDecline";
import AlertRowConfirmation from "@/features/alert/components/alert-row/AlertRowConfirmation";
import Note from "@/assets/icons/Note";
import {palette} from "@/theme";

interface AlertRowEntityProps {

}

const AlertRowEntity = ({}: AlertRowEntityProps) => {

    const alert = useAlertContext()

    const styles = StyleSheet.create({
        entityTile: {
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: palette.darkgrey,
            borderRadius: 4
        }
    })

    const handleRouteTrack = useCallback(() => {
        if(alert.getEntityType() === "Comment") return
        router.push(`/track/${alert.getEntity().id}`)
    }, [])

    const handleRouteNote = useCallback(() => {
        router.push(`/note/${alert.getEntity().id}`)
    }, [])

    const acceptCollabMutation = useCollabAccept()
    const declineCollabMutation = useCollabDecline()

    const handleConfirmCollab = useCallback(async () => {
        try {
            await acceptCollabMutation.mutateAsync({
                trackID: alert.getEntity().id
            })

            Toast.show('Collab accepted', TOASTCONFIG.success)
        } catch (e: any) {
            Toast.show(formatServerErrorResponse(e), TOASTCONFIG.success)
        }
    }, [acceptCollabMutation, alert])

    const handleDeclineCollab = useCallback(async () => {
        try {
            await declineCollabMutation.mutateAsync({
                trackID: alert.getEntity().id
            })

            Toast.show('Collab declined', TOASTCONFIG.success)
        } catch (e: any) {
            Toast.show(formatServerErrorResponse(e), TOASTCONFIG.success)
        }
    }, [alert, declineCollabMutation])

    const Content = useMemo(() => {

        if(alert.getAction() === 'Follow' && _.size(alert.getUsers()) === 1) {
            return(
                <FollowButton user={new User(alert.getUsers()[0])} />
            )
        }

        if(alert.getAction() === "Collab") {
            return(
                <AlertRowConfirmation
                    onConfirm={handleConfirmCollab}
                    onDecline={handleDeclineCollab}
                />
            )
        }

        switch (alert.getEntityType()) {
            case "Track": return(
                <TrackContextProvider track={new Track(alert.getEntity() as TrackInterface)}>
                    <TrackCover size={50} />
                </TrackContextProvider>
            )

            case "Note": return(
                <TouchableOpacity style={styles.entityTile} onPress={handleRouteNote}>
                    <Note />
                </TouchableOpacity>
            )
        }
    }, [alert, handleConfirmCollab, handleDeclineCollab, handleRouteTrack])

    return(
        <View>
            { Content }
        </View>
    )
}

export default AlertRowEntity