import { UserInputError } from "@vtex/api";

import serializeParams from "../utils/serializeParams";

export default async function validateCatalogId(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: {
      route: { params }
    }
  } = ctx;

  const { categoryId } = params;

  if (!categoryId) {
    throw new UserInputError("Category ID is missing");
  }

  ctx.state.categoryId = Number(serializeParams(categoryId));

  await next();
}
