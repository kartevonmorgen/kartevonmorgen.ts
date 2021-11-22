export interface HighlightConst {
  light: number
  dark: number
}

export interface ViewConst {
  highlight: HighlightConst
}

export const VIEW: ViewConst = {
  highlight: {
    light: 0.4,
    dark: 1,
  },
}