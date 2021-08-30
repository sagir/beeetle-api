export interface ListItem {
  id: number
  name: string
}

export interface ParentItem {
  id: number
  name: string
  children: ListItem[]
}
