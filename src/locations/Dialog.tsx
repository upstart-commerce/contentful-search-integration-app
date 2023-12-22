import React, { useEffect, useState } from 'react';
import { Paragraph, Accordion, Text, Checkbox, Button, Autocomplete, FormControl } from '@contentful/f36-components';
import { DialogAppSDK, SerializedJSONValue } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import CustomAutocomplete from '../components/CustomAutocomplete';

const Dialog = () => {
  const sdk = useSDK<DialogAppSDK>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [facets, setFacets] = useState<Record<string, any>>({});
  const [selectedFacets, setSelectedFacets] = useState<{ [key: string]: SerializedJSONValue; }>(sdk.parameters.invocation && typeof sdk.parameters.invocation === 'object' && !Array.isArray(sdk.parameters.invocation) ? sdk.parameters.invocation : {});
  const {apiKey, siteId, tenant} = sdk.parameters.installation;
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('https://nochannel-dev-1-api.nochannel-dev.upstart.team/v1/search/routes/catalog_live/search', {
        method: 'POST',
        body: JSON.stringify({"search":{"query":{"bool":{"filter":null,"must":[{"bool":{"should":[{"query_string":{"query":"*","boost":1}}]}},{"bool":{"should":[{"term":{"archived":"false"}}]}},{"bool":{"must":[]}}]}},"from":0,"size":0,"sort":[],"aggs":{}},"tracking":"slow","parentQueryId":null}),
        headers: {
          'x-upstart-api-key': apiKey,
          'X-Upstart-Site': siteId,
          'X-Upstart-Tenant': tenant
        }
      }
      );
      return response.json();
    };

    setIsLoading(true);
    fetchProducts().then(res => {
      setIsLoading(false);
     const aggregations = res.result.indexes.catalog_live.data.aggregations;
     setFacets(aggregations);
    });
  }, [apiKey, siteId, tenant, setFacets]);

  function onSave() {
    sdk.close(selectedFacets);
  }

  function onClose() {
    sdk.close(sdk.parameters.invocation?.valueOf());
    {
      seelcted: {
        colorName: ['Red', 'Blue'],
        brandName: ['Brand1', 'Samsung'],
      }
    }
  }

  const facetsList = Object.values(facets).map((facet: any) => {
    return {
      id: facet.meta.source.id,
      displayName: facet.meta.source.displayName,
      name: facet.meta.source.aggregation[facet.meta.source.metadata.type].field,
      buckets: facet.buckets.filter((b: any) => b.doc_count > 0)
    }
  }).filter(f => {
    return f.buckets.length > 0
  });

  const handleSelectItem = (facet: any, items: string[]) => {
    console.log(facet, items);
  };


  if (isLoading) {
    return <Text>Loading facets</Text>
  }

  return (
    <div style={{position: 'relative', paddingBottom: '60px', height: '100vh', maxHeight: '100vh', overflow: 'auto', paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px'}}>
      {facetsList.map(f => {
        return (
          <div key={f.id}>
            <FormControl>
              <FormControl.Label>{f.displayName}</FormControl.Label>
              <CustomAutocomplete items={f.buckets} onChange={(items) => handleSelectItem(f, items)} />
            </FormControl>
          </div>
        )
      })}
      <div style={{position: 'fixed', left: '0', right: '16px', bottom: '0', padding: '10px', display: 'flex', justifyContent: 'flex-end', background: 'white'}}>
        <Button variant="secondary" onClick={() => onClose()}>Cancel</Button>
        <Button variant="primary" onClick={() => onSave()}>Save</Button>
      </div>
    </div>
  )
};

export default Dialog;
