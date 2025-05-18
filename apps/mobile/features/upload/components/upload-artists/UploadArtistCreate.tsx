import {StyleSheet, View, Text} from "react-native";
import {useState} from "react";
import {palette, spacing} from "@/theme";
import {useUploadStoreSelectors} from "@/features/upload/store/upload";
import User from "@/features/user/classes/User";
import {v4 as uuidv4} from "uuid";
import RegisterForm from "@/features/auth/components/RegisterForm";
import Input from "@/common/components/inputs/Input";
import Button from "@/common/components/buttons/Button";
import { create } from "zustand";
import useAuthRegister from "@/features/auth/hooks/useAuthRegister";
import Toast from "react-native-root-toast";
import { TOASTCONFIG } from "@/common/constants";
import { formatServerErrorResponse } from "@/common/services/utilities";

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        gap: spacing.s,
    },
    notice: {
        backgroundColor: palette.rose + '40',
        padding: spacing.s,
    },
    noticeText: {
        color: palette.offwhite,
    },
});

const UploadArtistCreate = () => {
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const artists = useUploadStoreSelectors.artists()

    const {setState: setUploadState} = useUploadStoreSelectors.actions()

    const [loading, setLoading] = useState<boolean>(false);

    const registerMutation = useAuthRegister()

    const handleCreateArtist = async () => {
        try {

            setLoading(true);
            const { user } = await registerMutation.mutateAsync({
                email,
                username,
                label: false,
                code: null,
                newsletter: false,
            });

            console.log(user);

            setUploadState({
                artists: [
                    ...artists,
                    { artist: new User(user), role: "Artist", royalties: 0 },
                ],
            });

            Toast.show("User created and added", TOASTCONFIG.success);

            setEmail("");
            setUsername("");
        } catch (error: any) {
            console.error(error);
            Toast.show(formatServerErrorResponse(error), TOASTCONFIG.error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmail = (value: string) => {
        setEmail(value);
    };

    const handleUpdateUsername = (value: string) => {
        setUsername(value);
    };

    return (
        <View style={styles.wrapper}>
            <Input placeholder={"email"} value={email} onChangeText={handleUpdateEmail} />
            <Input placeholder={"username"} value={username} onChangeText={handleUpdateUsername} />

            <Button loading={loading} fill={"olive"} label={"Create Artist"} callback={handleCreateArtist} />
        </View>
    );
};

export default UploadArtistCreate;
