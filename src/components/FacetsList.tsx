import { EntityList } from '@contentful/f36-components'

import type { SearchResponse } from '../types'

interface FacetsListProps {
  products: SearchResponse[]
}

const FacetsList = ({ products }: FacetsListProps) => {
  return (
    <EntityList>
      {products.map(({ _source }, i) => {
        const { uri = '', altText = '' } = _source.media ? Object.values(_source.media)[0] : {}
        return (
          <EntityList.Item
            key={i}
            title={_source.name}
            thumbnailUrl={uri}
            thumbnailAltText={altText}
            aria-label={_source.name}
          />
        )
      })}
    </EntityList>
  )
}

export default FacetsList
