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

  const { catalogId } = params;

  if (!catalogId) {
    throw new UserInputError("Catalog ID is missing");
  }

  ctx.state.catalogId = Number(serializeParams(catalogId));

  await next();
}
