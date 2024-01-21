import { EntityList, SectionHeading } from '@contentful/f36-components'

import type { SearchResponse } from '../types'
import { styles } from './FacetsList.styles'

interface FacetsListProps {
  products: SearchResponse[]
}

const FacetsList = ({ products }: FacetsListProps) => {
  return products.length > 0 ? (
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
  ) : (
    <SectionHeading className={styles.noResult}>No items to display</SectionHeading>
  )
}

export default FacetsList
