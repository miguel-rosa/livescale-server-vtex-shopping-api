import { UserInputError } from "@vtex/api";

import serializeParams from "../utils/serializeParams";

export default async function validateBasketId(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: {
      route: { params }
    }
  } = ctx;

  const { basketId } = params;

  if (!basketId) {
    throw new UserInputError("Basket ID is missing");
  }

  ctx.state.basketId = serializeParams(basketId);

  await next();
}
