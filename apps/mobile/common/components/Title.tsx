import {StyleSheet, Text} from 'react-native';
import {ReactElement, useMemo} from 'react';
import {palette} from '@/theme';

interface TitleProps {
    center?: boolean;
    content: string;
    append?: ReactElement;
    truncate?: boolean; // Added truncate prop
}

const Title = ({ center, content, append, truncate = false }: TitleProps) => {
    const styles = useMemo(() => {
        return StyleSheet.create({
            content: {
                fontSize: 18,
                fontWeight: '600',
                color: palette.offwhite,
                textAlign: center ? 'center' : 'left',
            },
        });
    }, [center]);

    return (
        <Text
            style={styles.content}
            ellipsizeMode={truncate ? 'tail' : undefined}
            numberOfLines={truncate ? 1 : undefined}>
            {content} {!center && append}
        </Text>
    );
};

export default Title;