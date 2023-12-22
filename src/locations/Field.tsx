import React, { useCallback, useEffect, useState } from "react";
import {
  Paragraph,
  Button,
  ModalConfirm,
  Text,
  Flex,
  Checkbox,
} from "@contentful/f36-components";
import { DialogAppSDK, FieldAppSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";

function CheckboxCheckedOrIndeterminateExample() {
  return (
    <Flex flexDirection="column">
      <Checkbox id="checkbox1" name="checked-option-1" defaultChecked>
        Option 1 (uncontrolled checked)
      </Checkbox>
      <Checkbox
        id="checkbox1"
        name="controlled-option-2"
        isChecked
        onChange={() => {}}
      >
        Option 2 (controlled checked)
      </Checkbox>
      <Checkbox id="checkbox2" name="indeterminate-option-3" isIndeterminate>
        Option 3 (indeterminate)
      </Checkbox>
    </Flex>
  );
}

type FeaturePreviewProps = {
  selectedFacets: any;
};
const FeaturedProductPreview = (props: FeaturePreviewProps) => {
  const sdk = useSDK<FieldAppSDK>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Record<string, any>>([]);
  const { apiKey, siteId, tenant } = sdk.parameters.installation;
  useEffect(() => {
    const fetchProducts = async () => {
      const facets = props.selectedFacets ? Object.keys(props.selectedFacets).reduce((acc, key) => {
        const facets = props.selectedFacets[key];
        return acc.concat({
          terms: {
            [key]: facets
          }
        })
      }, [] as any[]) : []

      setIsLoading(true);

      const response = await fetch(
        "https://nochannel-dev-1-api.nochannel-dev.upstart.team/v1/search/routes/catalog_live/search",
        {
          method: "POST",
          body: JSON.stringify({
            search: {
              query: {
                bool: {
                  filter: null,
                  must: [
                    {
                      bool: {
                        should: [{ query_string: { query: "*", boost: 1 } }],
                      },
                    },
                    { bool: { should: [{ term: { archived: "false" } }] } },
                    { bool: { must: facets } },
                  ],
                },
              },
              from: 0,
              size: 5,
              sort: [],
              aggs: {},
            },
            tracking: "slow",
            parentQueryId: null,
          }),
          headers: {
            "x-upstart-api-key": apiKey,
            "X-Upstart-Site": siteId,
            "X-Upstart-Tenant": tenant,
          },
        }
      );
      return response.json();
    };

    fetchProducts().then((res) => {
      setIsLoading(false);
      const products = res.result.indexes.catalog_live.data.hits.hits.map(p => p._source)
      ;
      setProducts(products);
    });
  }, [apiKey, siteId, tenant, setProducts]);

  if (!products || products.length === 0) {
    return (
      <Button onClick={() => sdk.field.setValue(null)}>Reset Facets</Button>
    )
  }

  if (isLoading) {
    return <Text>Loading facets</Text>
  }

  return (
    <ul>
      {
        products.map(p => {
          return <li key={p.id}>{p.name}</li>
        })
      }
    </ul>
  )
};

// Featured Product Preview Field
const Field = () => {
  const [isShown, setShown] = useState(false);
  const sdk = useSDK<FieldAppSDK>();
  const [fieldValue, setFieldValue] = useState(sdk.field.getValue());
  console.log("Featured Product Preview Field Loaded");

  const handleDialogOpen = useCallback(async () => {
    const result = await sdk.dialogs.openCurrentApp({
      position: "center",
      title: "App Title",
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      width: 640,
      // there is no way for us to figure out the user's browser window height
      // but Uploadcare File Uploader expects to know it
      // so to make it work we're setting dialog's height to the max possible
      // -200px is just an assumption that all the Contentful UI related to dialogs (e.g. headline, cross button, etc)
      // will fit in 200px
      minHeight: "calc(100vh - 200px)",
      parameters: sdk.field.getValue()
    });

    console.log(result);
    sdk.field.setValue(result);
  }, [sdk.dialogs, sdk.field]);

  useEffect(() => {
    sdk.field.onValueChanged((val) => {
      console.log('onchange', val)
      setFieldValue(val);
    })
  }, [sdk])

  if (sdk.field.type !== "Object") {
    return <Paragraph>Expected field type: Object</Paragraph>;
  }

  if (!fieldValue || Object.keys(fieldValue).length === 0) {
    return (
      <>
        <Button onClick={handleDialogOpen}>Select Facets</Button>
      </>
    );
  }

  return (
    <>
      <Button onClick={handleDialogOpen}>Edit Facets</Button>
      <FeaturedProductPreview selectedFacets={fieldValue} />
    </>
  );
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/
  return (
    <Paragraph>Hello Entry Field Component (AppId: {sdk.ids.app})</Paragraph>
  );
};

export default Field;
