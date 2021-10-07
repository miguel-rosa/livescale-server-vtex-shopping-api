import convertCategories from "../utils/conveters/convertCategories";

export default class Catalogs {
  public async index(ctx: Context, next: () => Promise<any>) {
    const {
      clients: { search: searchClient }
    } = ctx;
    const categories = await searchClient.categories(1);
    ctx.body = convertCategories(categories);
    await next();
  }
}
