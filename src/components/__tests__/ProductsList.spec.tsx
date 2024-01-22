import { render, screen } from '@testing-library/react'

import type { SearchResponse } from '../../types'
import ProductsList from '../ProductsList'

describe('ProductsList', () => {
  it('renders nothing when products is an empty array', () => {
    render(<ProductsList products={[]} />)
    expect(screen.queryByRole('listitem')).toBeNull()
  })

  it('renders list of products', () => {
    const productsMock: SearchResponse[] = [
      {
        _index: '',
        _id: '',
        score: '',
        _source: {
          id: '',
          siteIds: [],
          typeId: '',
          type: '',
          typeName: '',
          name: 'Product 1',
          brandName: '',
          media: { media1: { uri: 'https://example.com/product1', altText: 'Product 1' } },
          tags: [],
          dynamicProperties: [],
          productItems: [],
          relatedIds: [],
          shippingMethodIds: [],
          activationDate: '',
          deactivationDate: '',
          taxCode: '',
          ignoreInventory: false,
          hidden: false,
          numReviews: 0,
          version: 0,
          subVersion: 0,
          seo: {
            pageTitle: '',
            description: '',
            metaKeywords: [],
          },
          liveDate: '',
          archived: false,
        },
      },
      {
        _index: '',
        _id: '',
        score: '',
        _source: {
          id: '',
          siteIds: [],
          typeId: '',
          type: '',
          typeName: '',
          name: 'Product 2',
          brandName: '',
          media: { media2: { uri: 'https://example.com/product2', altText: 'Product 2' } },
          tags: [],
          dynamicProperties: [],
          productItems: [],
          relatedIds: [],
          shippingMethodIds: [],
          activationDate: '',
          deactivationDate: '',
          taxCode: '',
          ignoreInventory: false,
          hidden: false,
          numReviews: 0,
          version: 0,
          subVersion: 0,
          seo: {
            pageTitle: '',
            description: '',
            metaKeywords: [],
          },
          liveDate: '',
          archived: false,
        },
      },
    ]

    render(<ProductsList products={productsMock} />)

    expect(screen.getByRole('listitem', { name: 'Product 1' })).toBeInTheDocument()
    expect(screen.getByRole('listitem', { name: 'Product 2' })).toBeInTheDocument()
  })

  it('handles products without media', () => {
    const productsMock: SearchResponse[] = [
      {
        _index: '',
        _id: '',
        score: '',
        _source: {
          id: '',
          siteIds: [],
          typeId: '',
          type: '',
          typeName: '',
          name: 'Product 1',
          brandName: '',
          tags: [],
          dynamicProperties: [],
          productItems: [],
          relatedIds: [],
          shippingMethodIds: [],
          activationDate: '',
          deactivationDate: '',
          taxCode: '',
          ignoreInventory: false,
          hidden: false,
          numReviews: 0,
          version: 0,
          subVersion: 0,
          seo: {
            pageTitle: '',
            description: '',
            metaKeywords: [],
          },
          liveDate: '',
          archived: false,
        },
      },
    ]

    render(<ProductsList products={productsMock} />)

    expect(screen.getByRole('listitem', { name: 'Product 1' })).toBeInTheDocument()
  })
})
