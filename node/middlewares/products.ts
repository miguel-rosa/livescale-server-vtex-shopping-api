export default class Products {
  public async index(_: Context, next: () => Promise<any>) {
    console.log("test");
    await next();
  }
}
