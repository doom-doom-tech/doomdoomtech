import {useCallback, useState} from "react";
import useSocialLogin from "@/features/auth/hooks/useSocialLogin";
import * as AppleAuthentication from 'expo-apple-authentication';
import Apple from "@/assets/icons/Apple";
import {router} from "expo-router";
import SocialLoginButton from "@/features/auth/components/socials/SocialLoginButton";
import {ActivityIndicator} from "react-native";
import {palette} from "@/theme";

const GoogleLogin = () => {

	const [loading, setLoading] = useState<boolean>(false);

	const socialLoginMutation = useSocialLogin()

	const handleAppleSignin = useCallback(async () => {
		try {
			setLoading(true)

			const credentials = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
			});

			await socialLoginMutation.mutateAsync({
				platform: 'apple',
				firstName: credentials.fullName?.givenName ?? '',
				lastName: credentials.fullName?.familyName ?? '',
				email: credentials.email,
				token: credentials.user,
				avatar_url: null
			});

			router.back();
		} catch (e: any) {
			console.error('Error during Apple Sign-In:', e);
		} finally {
			setLoading(false)
		}
	}, [socialLoginMutation])

    return(
        <SocialLoginButton
	        Icon={loading ? <ActivityIndicator color={palette.olive} /> : <Apple />}
	        callback={handleAppleSignin}
        />
    )
}

export default GoogleLogin