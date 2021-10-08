import { UserInputError } from "@vtex/api";
import convertProducts from "../utils/conveters/convertProducts";

export default class Products {
  public async index(ctx: Context, next: () => Promise<any>) {
    const {
      clients: { search: searchClient },
      state: { catalogId, categoryId }
    } = ctx;

    const categories = await searchClient.categories(1);

    const findCategory = categories.find(category => category.id === catalogId);

    if (!findCategory) {
      throw new UserInputError("Catalog id is missing or wrong");
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

    ctx.body = convertProducts(products);

    await next();
  }
}
