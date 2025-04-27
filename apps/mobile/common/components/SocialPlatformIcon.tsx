import {SocialPlatformInterface} from "@/features/user/types";
import {Fragment, ReactElement} from "react";
import Twitter from "@/assets/icons/Twitter";
import Tiktok from "@/assets/icons/Tiktok";
import Facebook from "@/assets/icons/Facebook";
import Snapchat from "@/assets/icons/Snapchat";
import Instagram from "@/assets/icons/Instagram";
import Link from "@/assets/icons/Link";
import Soundcloud from "@/assets/icons/Soundcloud";
import Spotify from "@/assets/icons/Spotify";

const SocialPlatformIcon = ({type}: { type: SocialPlatformInterface['type'] }): ReactElement => {
    switch (type) {
        case "Twitter": return <Twitter />
        case "Tiktok": return <Tiktok />
        case "Facebook": return <Facebook />
        case "Snapchat": return <Snapchat />
        case "Instagram": return <Instagram />
        case "Website": return <Link />
        case "Soundcloud": return <Soundcloud />
        case "Spotify": return <Spotify />
        default: return <Fragment />
    }
}

export default SocialPlatformIcon