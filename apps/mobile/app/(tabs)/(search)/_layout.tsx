import {Stack} from "expo-router";

const SearchLayout = () => {
    return  (
        <Stack screenOptions={{ headerShown: false }} initialRouteName={'charts/index'} />
    )
}

export default SearchLayout