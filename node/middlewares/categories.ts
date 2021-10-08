import { UserInputError } from "@vtex/api";
import convertCategories from "../utils/conveters/convertCategories";

export default class Categories {
  public async index(ctx: Context, next: () => Promise<any>) {
    const {
      clients: { search: searchClient },
      state: { catalogId }
    } = ctx;
    const categories = await searchClient.categories(1);
    const findCategory = categories.find(category => category.id === catalogId);

    if (!findCategory) {
      throw new UserInputError("Catalog id is missing or wrong");
    }

    ctx.body = convertCategories(findCategory.children);

    await next();
  }
}
