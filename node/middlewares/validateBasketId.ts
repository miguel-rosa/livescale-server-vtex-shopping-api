import { UserInputError } from '@vtex/api'
import serializeParams from '../utils/serializeParams'

export async function validateBasketId(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx
  
  const { basketId } = params
  
  console.log("basketId", basketId)
  
  if (!basketId) {
    throw new UserInputError('Basket Id is missing') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }

  ctx.state.basketId = serializeParams(basketId);

  await next()
}
