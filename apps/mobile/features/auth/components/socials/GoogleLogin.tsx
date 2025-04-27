import {GoogleSignin, SignInSuccessResponse} from "@react-native-google-signin/google-signin";
import {router} from "expo-router";
import {useCallback, useEffect} from "react";
import useSocialLogin from "@/features/auth/hooks/useSocialLogin";
import Google from "@/assets/icons/Google";
import SocialLoginButton from "@/features/auth/components/socials/SocialLoginButton";
import Toast from "react-native-root-toast";
import {TOASTCONFIG} from "@/common/constants";

const GoogleLogin = () => {

	const socialLoginMutation = useSocialLogin()

	const initializeGoogleLogin = useCallback( async () => {
	    try {
		    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

		    GoogleSignin.configure({
			    scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
			    webClientId: process.env['EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB'],
			    iosClientId: process.env['EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS'],
		    })
	    } catch (e: any) {}
	}, [])

	useEffect(() => {
		initializeGoogleLogin();
	}, []);

	const handleGoogleSignIn = useCallback(async () => {
		try {
			const response = await GoogleSignin.signIn();

			if(response.type === 'cancelled') return Toast.show("Login cancelled", TOASTCONFIG.warning)

			const {  data } = response as SignInSuccessResponse

			if(data.idToken && data.user) {
				await socialLoginMutation.mutateAsync({
					platform: 'google',
					token: data.idToken,
					firstName: data.user.givenName,
					lastName: data.user.familyName,
					email: data.user.email,
					avatar_url: data.user.photo
				});

				router.push('/feed')
			}
		} catch (e: any) {
			console.error('Error during Google Sign-In:', e);
		}
	}, [])

    return(
        <SocialLoginButton
	        Icon={<Google />}
	        callback={handleGoogleSignIn}
        />
    )
}

export default GoogleLogin