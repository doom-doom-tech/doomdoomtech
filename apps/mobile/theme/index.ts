export const spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32
}

export const palette = {
    offwhite: '#FAF3EC',
    lightgrey: '#D9D9D9',
    black: '#000000',
    ice: '#6AD9E0',
    teal: '#2E3A3A',
    darkgrey: '#303030',
    granite: '#808080',
    grey: '#1e1d1d',
    purple: '#180E1B',
    rose: '#CE5846',
    olive: '#80B473',
    error: '#b72727',
    transparent: '#FFFFFF00',
    platinum: '#a1d6cc',
    gold: '#f1c129',
    silver: '#dfdfdf',
    bronze: '#9a6e41',
    action: '#0078FF'
}

export const inputs = {


    main: {
        borderWidth: 0,
        minHeight: 40,
        paddingInline: 16,
        paddingBlock: 8,
        width: '100%',
        borderRadius: 4,
    },
    white: {
        borderRadius: 2,
        color: palette.darkgrey,
        backgroundColor: palette.offwhite
    },
    search: {
        backgroundColor: palette.grey,
        borderRadius: 100,
        color: palette.offwhite
    },
    grey: {
        backgroundColor: palette.grey,
        color: palette.offwhite
    },
    granite: {
        backgroundColor: palette.granite,
        color: palette.offwhite
    }
}

export const buttons = {
    main: {
        width: '100%',
        borderRadius: 4,
        paddingHorizontal: 70,
        paddingVertical: spacing.s,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    default: {
        minHeight: 48,
        backgroundColor: palette.rose,
        color: palette.darkgrey,
    },
    error: {
        backgroundColor: palette.error,
        color: palette.offwhite
    },
    granite: {
        backgroundColor: palette.granite,
    },
    olive: {
        backgroundColor: palette.olive,
    },
    pill: {
        backgroundColor: palette.rose,
        color: palette.offwhite,
        outline: 'none',
        borderRadius: 100,
        padding: spacing.s,
        paddingHorizontal: spacing.m,
        fontSize: 14,
        fontWeight: 500
    },
    follow: {
        background: 'none',
        color: palette.offwhite,
        border: `1px solid ${palette.offwhite}`
    },
    following: {
        padding: spacing.s,
        background: palette.rose,
        outline: 'none',
        color: palette.darkgrey,
        border: `1px solid ${palette.rose}`
    }
}

export const styling = {
    row: {
        xs: {
            alignItems: 'center',
            flexDirection: 'row',
            gap: 4
        },
        s: {
            alignItems: 'center',
            flexDirection: 'row',
            gap: spacing.s
        },
        m: {
            alignItems: 'center',
            flexDirection: 'row',
            gap: spacing.m
        },
    },
    column: {
        s: {
            flexDirection: 'column',
            gap: spacing.s
        },
        m: {
            flexDirection: 'column',
            gap: spacing.m
        },
    },
    text: {
        header: {
            fontSize: 18,
            color: palette.offwhite
        },
        light: {
            color: palette.offwhite
        },
        muted: {
            color: palette.granite
        }
    }
} as const

export const constants = {
    PROGRESS_BAR_HEIGHT: 20,
    TABBAR_HEIGHT: 100,
    TABBAR_PLAYER_HEIGHT: 80,
    FILE_SIZE_LIMIT: 20000000,
    MANDATORY_RATING_THRESHOLD: 3,
}

export const errors = {
    common: 'Oops... something went wrong. Please try again later'
}