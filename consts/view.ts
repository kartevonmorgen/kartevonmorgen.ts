export interface HighlightConst {
  light: number
  dark: number
}

// [0 - 1]
export interface Size {
  width: number
  height: number
}

export enum ResponsiveKeys {
  default = 'default',
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

export type ResponsiveSize = Record<ResponsiveKeys, Size>

export const ORDERED_RESPONSIVE_KEYS = [
  ResponsiveKeys.xs,
  ResponsiveKeys.sm,
  ResponsiveKeys.md,
  ResponsiveKeys.lg,
  ResponsiveKeys.xl,
]

export interface SidebarConst {
  size: ResponsiveSize
}

export interface ViewConst {
  highlight: HighlightConst
  sidebar: SidebarConst
}

export const VIEW: ViewConst = {
  highlight: {
    light: 0.4,
    dark: 1,
  },
  sidebar: {
    size: {
      default: {
        width: 0,
        height: 1,
      },
      xs: {
        width: 0.75,
        height: 1,
      },
      sm: {
        width: 0.75,
        height: 1,
      },
      md: {
        width: 0.5,
        height: 1,
      },
      lg: {
        width: 0.4,
        height: 1,
      },
      xl: {
        width: 0.4,
        height: 1,
      },
    },
  },
}