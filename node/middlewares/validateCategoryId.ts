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
    throw new UserInputError("categoryId ID is missing"); // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }

  ctx.state.categoryId = Number(serializeParams(categoryId));

  await next();
}
