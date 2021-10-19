import { UserInputError } from "@vtex/api";
import getCurrencyCode from "../resolvers/currencyCode";
import convertProducts from "../utils/conveters/convertProducts";
import convertSalesChannels from "../utils/conveters/convertSalesChannels";

export default class Products {
  public async index(ctx: Context, next: () => Promise<any>) {
    const {
      clients: { search: searchClient },
      state: { catalogId, categoryId }
    } = ctx;

    const categories = await searchClient.categories(1);

    const findCategory = categories.find(category => category.id === catalogId);

    if (!findCategory) {
      throw new UserInputError("Catalog ID is missing or wrong");
    }

    const products = await searchClient.products({
      catalogId,
      categoryId,
      hideUnavailableItems: true,
      from: 0,
      to: 49
    });

    if (!products || products.length === 0) {
      throw new UserInputError("Products not found, check the categories tree");
    }
    const currencyCode = await getCurrencyCode(null, null, ctx);
    if (!currencyCode) {
      const salesChannels = await searchClient.salesChannels();
      ctx.state.fallbackCurrencyCode = convertSalesChannels(
        salesChannels
      )[0].CurrencyCode;
    } else {
      ctx.state.fallbackCurrencyCode = currencyCode;
    }

    ctx.body = convertProducts(products, ctx.state.fallbackCurrencyCode).filter(
      product => product.variants.length > 0
    );

    await next();
  }
}
