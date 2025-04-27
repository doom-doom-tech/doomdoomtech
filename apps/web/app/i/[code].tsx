import {useFocusEffect, useLocalSearchParams} from "expo-router";

const Invited = () => {

    const { code } = useLocalSearchParams()

    useFocusEffect(() => {
        if (code) window.location.href = `doomdoomtech://invite?code=${code}`
    })

    return <></>
}

export default Invited