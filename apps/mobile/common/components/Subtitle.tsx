import {StyleSheet, Text} from 'react-native';
import {useMemo} from 'react';
import {palette} from '@/theme';

interface SubtitleProps {
    center?: boolean;
    content: string;
    truncate?: boolean; // Added truncate prop
}

const Subtitle = ({ center, content, truncate = false }: SubtitleProps) => {
    const styles = useMemo(() => {
        return StyleSheet.create({
            content: {
                fontSize: 12,
                color: palette.granite,
                textAlign: center ? 'center' : 'left',
            },
        });
    }, [center]);

    return (
        <Text
            style={styles.content}
            ellipsizeMode={truncate ? 'tail' : undefined}
            numberOfLines={truncate ? 1 : undefined}>
            {content}
        </Text>
    );
};

export default Subtitle;