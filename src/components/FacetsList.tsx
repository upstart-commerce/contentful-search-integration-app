import { FormControl } from '@contentful/f36-components'

import Autocomplete from '../components/Autocomplete'
import type { Aggregation, DialogInvocationParameters } from '../types'

interface FacetsListProps {
  facets: Aggregation[]
  fieldValues: DialogInvocationParameters
  handleSelectItem: (selectedFacet: Aggregation, selectedBuckets: string[]) => void
}

const FacetsList = ({ facets, fieldValues, handleSelectItem }: FacetsListProps) => {
  const getSelectedBuckets = ({ meta }: Aggregation): string[] => {
    const name = meta.source.name
    return fieldValues.selected &&
      name in fieldValues.selected &&
      fieldValues.selected[name].buckets
      ? fieldValues.selected[name].buckets
      : []
  }

  return (
    <div>
      {facets.map((facet) => (
        <div key={facet.meta.source.id}>
          <FormControl>
            <FormControl.Label>{facet.meta.source.displayName}</FormControl.Label>
            <Autocomplete
              items={facet.buckets}
              onChange={(items) => handleSelectItem(facet, items)}
              selected={getSelectedBuckets(facet)}
            />
          </FormControl>
        </div>
      ))}
    </div>
  )
}

export default FacetsList
