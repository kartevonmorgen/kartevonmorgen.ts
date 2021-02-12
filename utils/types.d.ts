export type RouterQueryParam = string | string[]
export interface RouterQuery {
  [index: string]: RouterQueryParam
}