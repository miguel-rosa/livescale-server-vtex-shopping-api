/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
export default function saveCurrencyCode(
  _: any,
  { currencyCode }: { currencyCode: string },
  ctx: Context
) {
  return ctx.clients.vbase
    .saveJSON("l-s", "configs", { currencyCode })
    .then(_ => "success");
}
