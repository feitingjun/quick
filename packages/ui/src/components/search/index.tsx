import _Search, { type SearchProps } from './search'
import Item, { type SearchItemProps } from './item'

type CompoundedComponent = typeof _Search & {
  Item: typeof Item
}

const Search = _Search as CompoundedComponent
Search.Item = Item

export type { SearchProps, SearchItemProps }

export default Search
