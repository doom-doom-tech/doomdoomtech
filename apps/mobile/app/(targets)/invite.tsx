import {Redirect, RelativePathString, useLocalSearchParams} from "expo-router";

const invite = () => {

    const { code } = useLocalSearchParams()

    if(!code) return <Redirect href="/" />
    return <Redirect href={"/auth?code=".concat(code as string) as RelativePathString} />
}

export default invite