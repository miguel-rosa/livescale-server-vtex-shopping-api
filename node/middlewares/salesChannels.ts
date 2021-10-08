import convertSalesChannels from "../utils/conveters/convertSalesChannels";

export default class SalesChannels {
  public async index(ctx: Context, next: () => Promise<any>) {
    const {
      clients: { search: searchClient }
    } = ctx;

    const salesChannels = await searchClient.salesChannels();
    ctx.body = convertSalesChannels(salesChannels);

    await next();
  }
}
