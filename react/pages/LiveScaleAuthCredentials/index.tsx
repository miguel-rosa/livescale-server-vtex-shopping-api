import React, { useState, useEffect, useCallback, SyntheticEvent } from "react";
import { useMutation } from "react-apollo";
import { useIntl } from "react-intl";
import {
  Layout,
  PageHeader,
  PageBlock,
  Button,
  Dropdown,
  ToastProvider,
  ToastConsumer
} from "vtex.styleguide";

import { salesChannelsList } from "../../api";
import saveCurrencyCodeGQL from "../../graphql/saveCurrencyCode.graphql";
import convertCurrencyCode from "../../utils/convertCurrencyCode";
import {
  TCurrencyCode,
  CurrencyCodeResponse
} from "../../typings/LiveScaleAuthCredentials";

const LiveScaleAuthCredentials: React.FC = () => {
  const [currencyCodes, setCurrencyCodes] = useState<TCurrencyCode[]>([]);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>();
  const { formatMessage } = useIntl();
  const [saveCurrencyCode] = useMutation(saveCurrencyCodeGQL);

  const getCurrencyCodes = useCallback(async () => {
    const { url, options } = salesChannelsList();
    const data = await fetch(url, options);
    const response: CurrencyCodeResponse[] = await data.json();

    const formattedResponse: TCurrencyCode[] = response.map(
      ({ CurrencyCode, CurrencySymbol, Name }, index) => ({
        value: `${CurrencyCode}-${index}`,
        label: `${Name}: ${CurrencySymbol} ${CurrencyCode}`
      })
    );
    setCurrencyCodes(formattedResponse);
    setSelectedCurrencyCode(formattedResponse[0].value);
  }, []);

  const handleInputChange = (_: SyntheticEvent, value: string) => {
    setSelectedCurrencyCode(value);
  };

  const handleSubmit = async (showToast: any) => {
    saveCurrencyCode({
      variables: { currencyCode: convertCurrencyCode(selectedCurrencyCode) }
    })
      .catch((err: any) => {
        console.error(err);
        showToast({
          message: formatMessage({
            id:
              "admin/livescale-server-vtex-shopping-api-admin.save-settings-failure"
          }),
          duration: 5000
        });
      })
      .then(() => {
        showToast({
          message: formatMessage({
            id:
              "admin/livescale-server-vtex-shopping-api-admin.save-settings-success"
          }),
          duration: 5000
        });
      });
  };

  useEffect(() => {
    getCurrencyCodes();
  }, [getCurrencyCodes]);

  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {/* eslint-disable-next-line react/no-unused-prop-types */}
        {({ showToast }: { showToast: any }) => (
          <Layout pageHeader={<PageHeader title="Live Scale" />}>
            <PageBlock variation="full">
              <section className="pb4">
                <Dropdown
                  label={formatMessage({
                    id:
                      "admin/livescale-server-vtex-shopping-api-admin.currency-code-dropdown-label"
                  })}
                  placeholder={formatMessage({
                    id:
                      "admin/livescale-server-vtex-shopping-api-admin.currency-code-dropdown-placeholder"
                  })}
                  options={currencyCodes}
                  value={selectedCurrencyCode}
                  onChange={handleInputChange}
                />
              </section>
              <section className="pt4">
                <Button
                  variation="primary"
                  onClick={() => handleSubmit(showToast)}
                >
                  {formatMessage({
                    id:
                      "admin/livescale-server-vtex-shopping-api-admin.submit-button"
                  })}
                </Button>
              </section>
            </PageBlock>
          </Layout>
        )}
      </ToastConsumer>
    </ToastProvider>
  );
};

export { LiveScaleAuthCredentials };
