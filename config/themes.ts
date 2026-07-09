import type { ThemeDefinition } from 'vuetify'

/** Mix a hex color towards white (`amount > 0`) or black (`amount < 0`). */
function shade(hex: string, amount: number): string {
    const n = parseInt(hex.slice(1), 16)
    const target = amount < 0 ? 0 : 255
    const p = Math.abs(amount)
    const mix = (channel: number) => Math.round((target - channel) * p) + channel
    const r = mix((n >> 16) & 0xff)
    const g = mix((n >> 8) & 0xff)
    const b = mix(n & 0xff)
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
}

/** Relative luminance of a hex color, per WCAG 2.x. */
function luminance(hex: string): number {
    const n = parseInt(hex.slice(1), 16)
    const channel = (c: number) => {
        const s = c / 255
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * channel((n >> 16) & 0xff) + 0.7152 * channel((n >> 8) & 0xff) + 0.0722 * channel(n & 0xff)
}

/** Black or white, whichever has the higher WCAG contrast ratio against `hex`. */
function onColor(hex: string): string {
    // Contrast vs black beats contrast vs white when (L + 0.05)^2 > 1.05 * 0.05.
    return (luminance(hex) + 0.05) ** 2 > 0.0525 ? '#000000' : '#FFFFFF'
}

interface ThemeSpec {
    dark: boolean
    /** App/window background. */
    background: string
    /** Cards, sheets, elevated surfaces. */
    surface: string
    /** High-contrast foreground for text, icons and solid buttons. */
    foreground: string
    /** Muted foreground for secondary text and borders. */
    muted: string
    primary: string
    secondary: string
    error: string
    info: string
    success: string
    warning: string
}

function buildTheme(spec: ThemeSpec): ThemeDefinition {
    const { dark, background, surface, foreground, muted } = spec
    // Dark themes get lighter tints for raised surfaces; light themes get darker.
    const step = dark ? 1 : -1
    return {
        dark,
        colors: {
            background,
            surface,
            'surface-bright': shade(surface, step * 0.1),
            'surface-light': shade(surface, step * 0.06),
            'surface-variant': shade(surface, step * 0.16),
            'on-surface-variant': muted,
            primary: spec.primary,
            'on-primary': onColor(spec.primary),
            'primary-darken-1': shade(spec.primary, -0.18),
            'on-primary-darken-1': onColor(shade(spec.primary, -0.18)),
            secondary: spec.secondary,
            'on-secondary': onColor(spec.secondary),
            'secondary-darken-1': shade(spec.secondary, -0.18),
            'on-secondary-darken-1': onColor(shade(spec.secondary, -0.18)),
            error: spec.error,
            info: spec.info,
            success: spec.success,
            warning: spec.warning,
            foreground,
        },
        variables: {
            'border-color': foreground,
            'high-emphasis-opacity': 0.92,
            'medium-emphasis-opacity': 0.68,
            'theme-kbd': shade(surface, step * 0.16),
            'theme-on-kbd': foreground,
            'theme-code': shade(surface, step * 0.06),
            'theme-on-code': muted,
        },
    }
}

export const themes = {
    dark: buildTheme({
        dark: true,
        background: '#060708',
        surface: '#121417',
        foreground: '#FBFCFD',
        muted: '#9AA0A6',
        primary: '#F56217',
        secondary: '#4A9EFF',
        error: '#FF5370',
        info: '#82AAFF',
        success: '#4CD98A',
        warning: '#FFB454',
    }),
    light: buildTheme({
        dark: false,
        background: '#FBFCFD',
        surface: '#EFF1F4',
        foreground: '#060708',
        muted: '#5A6069',
        primary: '#F56217',
        secondary: '#1867C0',
        error: '#B00020',
        info: '#2196F3',
        success: '#2E7D32',
        warning: '#ED6C02',
    }),
    oled: buildTheme({
        dark: true,
        background: '#000000',
        surface: '#0A0B0D',
        foreground: '#FBFCFD',
        muted: '#8A9096',
        primary: '#F56217',
        secondary: '#4A9EFF',
        error: '#FF5370',
        info: '#82AAFF',
        success: '#4CD98A',
        warning: '#FFB454',
    }),
    dracula: buildTheme({
        dark: true,
        background: '#282A36',
        surface: '#44475A',
        foreground: '#F8F8F2',
        muted: '#6272A4',
        primary: '#BD93F9',
        secondary: '#FF79C6',
        error: '#FF5555',
        info: '#8BE9FD',
        success: '#50FA7B',
        warning: '#F1FA8C',
    }),
    nord: buildTheme({
        dark: true,
        background: '#2E3440',
        surface: '#3B4252',
        foreground: '#ECEFF4',
        muted: '#D8DEE9',
        primary: '#88C0D0',
        secondary: '#81A1C1',
        error: '#BF616A',
        info: '#5E81AC',
        success: '#A3BE8C',
        warning: '#EBCB8B',
    }),
    solarized: buildTheme({
        dark: true,
        background: '#002B36',
        surface: '#073642',
        foreground: '#93A1A1',
        muted: '#839496',
        primary: '#268BD2',
        secondary: '#2AA198',
        error: '#DC322F',
        info: '#6C71C4',
        success: '#859900',
        warning: '#B58900',
    }),
    gruvbox: buildTheme({
        dark: true,
        background: '#282828',
        surface: '#3C3836',
        foreground: '#EBDBB2',
        muted: '#D5C4A1',
        primary: '#FABD2F',
        secondary: '#8EC07C',
        error: '#FB4934',
        info: '#83A598',
        success: '#B8BB26',
        warning: '#FE8019',
    }),
    monokai: buildTheme({
        dark: true,
        background: '#272822',
        surface: '#3E3D32',
        foreground: '#F8F8F2',
        muted: '#CFCFC2',
        primary: '#F92672',
        secondary: '#66D9EF',
        error: '#FF6188',
        info: '#66D9EF',
        success: '#A6E22E',
        warning: '#FD971F',
    }),
    onedark: buildTheme({
        dark: true,
        background: '#282C34',
        surface: '#21252B',
        foreground: '#ABB2BF',
        muted: '#828997',
        primary: '#61AFEF',
        secondary: '#C678DD',
        error: '#E06C75',
        info: '#56B6C2',
        success: '#98C379',
        warning: '#E5C07B',
    }),
    tokyonight: buildTheme({
        dark: true,
        background: '#1A1B26',
        surface: '#24283B',
        foreground: '#C0CAF5',
        muted: '#A9B1D6',
        primary: '#7AA2F7',
        secondary: '#BB9AF7',
        error: '#F7768E',
        info: '#7DCFFF',
        success: '#9ECE6A',
        warning: '#E0AF68',
    }),
    catppuccin: buildTheme({
        dark: true,
        background: '#1E1E2E',
        surface: '#313244',
        foreground: '#CDD6F4',
        muted: '#BAC2DE',
        primary: '#CBA6F7',
        secondary: '#F5C2E7',
        error: '#F38BA8',
        info: '#89DCEB',
        success: '#A6E3A1',
        warning: '#F9E2AF',
    }),
    nightowl: buildTheme({
        dark: true,
        background: '#011627',
        surface: '#1D3B53',
        foreground: '#D6DEEB',
        muted: '#8BADC1',
        primary: '#82AAFF',
        secondary: '#C792EA',
        error: '#EF5350',
        info: '#7FDBCA',
        success: '#ADDB67',
        warning: '#F78C6C',
    }),
    synthwave: buildTheme({
        dark: true,
        background: '#262335',
        surface: '#34294F',
        foreground: '#F8F8F8',
        muted: '#B6B1D8',
        primary: '#FF7EDB',
        secondary: '#36F9F6',
        error: '#FE4450',
        info: '#36F9F6',
        success: '#72F1B8',
        warning: '#FEDE5D',
    }),
    rosepine: buildTheme({
        dark: true,
        background: '#191724',
        surface: '#1F1D2E',
        foreground: '#E0DEF4',
        muted: '#908CAA',
        primary: '#C4A7E7',
        secondary: '#EBBCBA',
        error: '#EB6F92',
        info: '#9CCFD8',
        success: '#31748F',
        warning: '#F6C177',
    }),
    ayu: buildTheme({
        dark: true,
        background: '#0A0E14',
        surface: '#1F2430',
        foreground: '#B3B1AD',
        muted: '#8A9199',
        primary: '#FFB454',
        secondary: '#59C2FF',
        error: '#F07178',
        info: '#39BAE6',
        success: '#C2D94C',
        warning: '#FF8F40',
    }),
    github: buildTheme({
        dark: true,
        background: '#0D1117',
        surface: '#161B22',
        foreground: '#C9D1D9',
        muted: '#8B949E',
        primary: '#58A6FF',
        secondary: '#BC8CFF',
        error: '#F85149',
        info: '#79C0FF',
        success: '#3FB950',
        warning: '#D29922',
    }),
    // Accents taken from the official Rubik's cube sticker colors.
    rubiks: buildTheme({
        dark: true,
        background: '#0E0F13',
        surface: '#191B21',
        foreground: '#F8F9FA',
        muted: '#9AA0A6',
        primary: '#FFD500',
        secondary: '#2E6FDB',
        error: '#E3123D',
        info: '#4A9EFF',
        success: '#00B85C',
        warning: '#FF5800',
    }),
    everforest: buildTheme({
        dark: true,
        background: '#2D353B',
        surface: '#343F44',
        foreground: '#D3C6AA',
        muted: '#859289',
        primary: '#A7C080',
        secondary: '#7FBBB3',
        error: '#E67E80',
        info: '#83C092',
        success: '#A7C080',
        warning: '#DBBC7F',
    }),
    kanagawa: buildTheme({
        dark: true,
        background: '#1F1F28',
        surface: '#2A2A37',
        foreground: '#DCD7BA',
        muted: '#727169',
        primary: '#7E9CD8',
        secondary: '#957FB8',
        error: '#FF5D62',
        info: '#7FB4CA',
        success: '#98BB6C',
        warning: '#FF9E3B',
    }),
    palenight: buildTheme({
        dark: true,
        background: '#292D3E',
        surface: '#32374D',
        foreground: '#A6ACCD',
        muted: '#676E95',
        primary: '#C792EA',
        secondary: '#82AAFF',
        error: '#F07178',
        info: '#89DDFF',
        success: '#C3E88D',
        warning: '#FFCB6B',
    }),
    horizon: buildTheme({
        dark: true,
        background: '#1C1E26',
        surface: '#232530',
        foreground: '#D5D8DA',
        muted: '#6C6F93',
        primary: '#E95678',
        secondary: '#B877DB',
        error: '#F43E5C',
        info: '#26BBD9',
        success: '#29D398',
        warning: '#FAB795',
    }),
    cobalt: buildTheme({
        dark: true,
        background: '#193549',
        surface: '#1F4662',
        foreground: '#FFFFFF',
        muted: '#A0B3C5',
        primary: '#FFC600',
        secondary: '#0088FF',
        error: '#FF628C',
        info: '#80FCFF',
        success: '#3AD900',
        warning: '#FF9D00',
    }),
    // https://github.com/daltonmenezes/aura-theme (Main > Dark palette)
    aura: buildTheme({
        dark: true,
        background: '#15141B',
        surface: '#21202E',
        foreground: '#EDECEE',
        muted: '#6D6D6D',
        primary: '#A277FF',
        secondary: '#F694FF',
        error: '#FF6767',
        info: '#82E2FF',
        success: '#61FFCA',
        warning: '#FFCA85',
    }),
    solarizedLight: buildTheme({
        dark: false,
        background: '#FDF6E3',
        surface: '#EEE8D5',
        foreground: '#586E75',
        muted: '#93A1A1',
        primary: '#268BD2',
        secondary: '#2AA198',
        error: '#DC322F',
        info: '#6C71C4',
        success: '#859900',
        warning: '#B58900',
    }),
    catppuccinLatte: buildTheme({
        dark: false,
        background: '#EFF1F5',
        surface: '#E6E9EF',
        foreground: '#4C4F69',
        muted: '#6C6F85',
        primary: '#8839EF',
        secondary: '#EA76CB',
        error: '#D20F39',
        info: '#04A5E5',
        success: '#40A02B',
        warning: '#DF8E1D',
    }),
    githubLight: buildTheme({
        dark: false,
        background: '#FFFFFF',
        surface: '#F6F8FA',
        foreground: '#24292F',
        muted: '#57606A',
        primary: '#0969DA',
        secondary: '#8250DF',
        error: '#CF222E',
        info: '#218BFF',
        success: '#1A7F37',
        warning: '#9A6700',
    }),
} satisfies Record<string, ThemeDefinition>

export type ThemeName = keyof typeof themes

export const defaultThemeName: ThemeName = 'dark'

export interface ThemeOption {
    value: ThemeName
    /** i18n key for the theme's display name. */
    label: string
    icon: string
}

/** Selectable themes shown in the appearance settings, in display order. */
export const themeOptions: ThemeOption[] = [
    { value: 'dark', label: 'settings.appearance.themeDark', icon: 'mdi-weather-night' },
    { value: 'light', label: 'settings.appearance.themeLight', icon: 'mdi-white-balance-sunny' },
    { value: 'oled', label: 'settings.appearance.themeOled', icon: 'mdi-brightness-2' },
    { value: 'rubiks', label: 'settings.appearance.themeRubiks', icon: 'mdi-cube' },
    { value: 'dracula', label: 'settings.appearance.themeDracula', icon: 'mdi-bat' },
    { value: 'nord', label: 'settings.appearance.themeNord', icon: 'mdi-snowflake' },
    { value: 'solarized', label: 'settings.appearance.themeSolarized', icon: 'mdi-weather-sunny' },
    { value: 'solarizedLight', label: 'settings.appearance.themeSolarizedLight', icon: 'mdi-brightness-5' },
    { value: 'gruvbox', label: 'settings.appearance.themeGruvbox', icon: 'mdi-pine-tree' },
    { value: 'monokai', label: 'settings.appearance.themeMonokai', icon: 'mdi-palette-swatch' },
    { value: 'onedark', label: 'settings.appearance.themeOnedark', icon: 'mdi-atom' },
    { value: 'tokyonight', label: 'settings.appearance.themeTokyonight', icon: 'mdi-city' },
    { value: 'catppuccin', label: 'settings.appearance.themeCatppuccin', icon: 'mdi-cat' },
    { value: 'catppuccinLatte', label: 'settings.appearance.themeCatppuccinLatte', icon: 'mdi-coffee' },
    { value: 'nightowl', label: 'settings.appearance.themeNightowl', icon: 'mdi-owl' },
    { value: 'synthwave', label: 'settings.appearance.themeSynthwave', icon: 'mdi-sine-wave' },
    { value: 'rosepine', label: 'settings.appearance.themeRosepine', icon: 'mdi-flower' },
    { value: 'ayu', label: 'settings.appearance.themeAyu', icon: 'mdi-moon-waning-crescent' },
    { value: 'everforest', label: 'settings.appearance.themeEverforest', icon: 'mdi-tree' },
    { value: 'kanagawa', label: 'settings.appearance.themeKanagawa', icon: 'mdi-waves' },
    { value: 'palenight', label: 'settings.appearance.themePalenight', icon: 'mdi-weather-night-partly-cloudy' },
    { value: 'horizon', label: 'settings.appearance.themeHorizon', icon: 'mdi-weather-sunset' },
    { value: 'cobalt', label: 'settings.appearance.themeCobalt', icon: 'mdi-lightning-bolt' },
    { value: 'aura', label: 'settings.appearance.themeAura', icon: 'mdi-flare' },
    { value: 'github', label: 'settings.appearance.themeGithub', icon: 'mdi-github' },
    { value: 'githubLight', label: 'settings.appearance.themeGithubLight', icon: 'mdi-github' },
]
