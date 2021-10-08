import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import {
  Layout,
  PageHeader,
  PageBlock,
  Button,
  Dropdown
} from "vtex.styleguide";

import { salesChannelsList } from "../../api";

type TCurrencyCode = {
  label: string;
  value: string;
};

type CurrencyCodeResponse = {
  Name: string;
  CurrencyCode: string;
  CurrencySymbol: string;
};

const LiveScaleAuthCredentials: React.FC = () => {
  const [currencyCodes, setCurrencyCodes] = useState<TCurrencyCode[]>([]);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>();

  const getCurrencyCodes = async () => {
    const { url, options } = salesChannelsList();
    const data = await fetch(url, options);
    const response: CurrencyCodeResponse[] = await data.json();
    const formattedResponse: TCurrencyCode[] = response.map(
      ({ CurrencyCode, CurrencySymbol, Name }) => ({
        value: CurrencyCode,
        label: `${Name}: ${CurrencySymbol} ${CurrencyCode}`
      })
    );
    setCurrencyCodes(formattedResponse);
    setSelectedCurrencyCode(formattedResponse[0].value);
  };

  useEffect(() => {
    getCurrencyCodes();
  }, [getCurrencyCodes]);

  return (
    <Layout pageHeader={<PageHeader title="Live Scale" />}>
      <PageBlock variation="full">
        <section className="pb4">
          <Dropdown
            label={
              <FormattedMessage id="admin/livescale-server-vtex-shopping-api-admin.currency-code-dropdown-title" />
            }
            placeholder={
              <FormattedMessage id="admin/livescale-server-vtex-shopping-api-admin.currency-code-dropdown-placeholder" />
            }
            options={currencyCodes}
            value={selectedCurrencyCode}
            onChange={(_: any, value: string) => setSelectedCurrencyCode(value)}
          />
        </section>
        <section className="pt4">
          <Button variation="primary" onClick={() => {}}>
            <FormattedMessage id="admin/livescale-server-vtex-shopping-api-admin.submit-button" />
          </Button>
        </section>
      </PageBlock>
    </Layout>
  );
};

export { LiveScaleAuthCredentials };
