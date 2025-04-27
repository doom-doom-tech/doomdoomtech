import {StyleSheet, Switch as NativeSwitch} from 'react-native'
import {useMemo} from "react";
import {palette} from "@/theme";

interface SwitchProps {
    value: boolean
    callback?: (value: boolean) => void
}

const Switch = ({value, callback}: SwitchProps) => {

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    return(
        <NativeSwitch
            value={value}
            onValueChange={callback}
            trackColor={{ false: palette.granite, true: palette.olive }}
        />
    )
}

export default Switch