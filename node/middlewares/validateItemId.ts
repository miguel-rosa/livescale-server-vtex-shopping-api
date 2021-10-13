import { UserInputError } from "@vtex/api";

import serializeParams from "../utils/serializeParams";

export default async function validateItemId(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: {
      route: { params }
    }
  } = ctx;

  const { itemId } = params;

  if (!itemId) {
    throw new UserInputError("Item ID is missing");
  }

  ctx.state.itemId = serializeParams(itemId);

  await next();
}
