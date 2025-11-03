import StyledSearch, { type SearchProps } from './search'
import Item, { type SearchItemProps } from './item'

type CompoundedComponent = typeof StyledSearch & {
  Item: typeof Item
}

const Search = StyledSearch as CompoundedComponent
Search.Item = Item

export type { SearchProps, SearchItemProps }

export default Search
