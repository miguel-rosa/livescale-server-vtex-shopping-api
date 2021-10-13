export const salesChannelsList = () => ({
  url: "/_v/sales-channels",
  options: {
    method: "GET"
  }
});

export const currencyCodeCreate = (body: string | undefined) => ({
  url:
    "https://app.io.vtex.com/motorolatemplateeu.livescale-server-vtex-shopping-api/v0/motorolafr/migueldev/_v/currency-code",
  options: {
    method: "POST",
    body: JSON.stringify({
      currencyCode: body
    })
  }
});
