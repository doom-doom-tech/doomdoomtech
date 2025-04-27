import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {palette} from '@/theme';
import {IconProps} from '@expo/vector-icons/build/createIconSet';
import Ten from "@/assets/icons/Ten";
import Logo from "@/assets/icons/Logo";
import Hashtag from "@/assets/icons/Hashtag";

const CUSTOM_ICONS = {
    'ten': Ten,
    'logo': Logo,
    'hashtag': Hashtag,
}

interface IconPropsInterface {
    name: IconProps<any>['name'];
    pack?: 'feather' | 'oct' | 'fa' | 'fontisto' | 'material' | 'ion' | 'custom';
    size?: number;
    color?: keyof typeof palette;
}

const ICON_MAP = {
    feather: Feather,
    oct: Octicons,
    fa: FontAwesome,
    fontisto: Fontisto,
    ion: Ionicons,
    material: MaterialCommunityIcons,
};

const Icon: React.FC<IconPropsInterface> = ({
    name,
    pack = 'feather',
    size = 24,
    color = 'black',
}) => {

    if(pack === 'custom') {
        const CustomIcon = CUSTOM_ICONS[name as keyof typeof CUSTOM_ICONS];

        if (!CustomIcon) {
            throw new Error(`Icon "${name}" not found in custom pack`);
        }
        return <CustomIcon width={size} height={size} fill={palette[color]} />;
    }

    const SelectedIcon = ICON_MAP[pack];
    if (!SelectedIcon) {
        throw new Error(`Invalid icon pack "${pack}" supplied`);
    }

    return <SelectedIcon name={name} size={size} color={palette[color as keyof typeof palette]} />;
};

export default Icon;