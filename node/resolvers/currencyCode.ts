/* eslint-disable no-shadow */
export default function currencyCode(_: any, __: any, ctx: Context) {
  return ctx.clients.vbase
    .getJSON<{ currencyCode: string }>("l-s", "configs")
    .then(({ currencyCode }) => currencyCode);
}
