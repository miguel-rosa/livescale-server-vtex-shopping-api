import { json } from 'co-body'
import { ResolverError } from '@vtex/api'

import convertBasketItem from '../utils/conveters/convertBasketItem'
import convertBasketResponse from '../utils/conveters/convertBasketResponse';

export async function baskets(ctx: Context, next: () => Promise<any>) {
  const {
    state: { basketId },
    clients: { checkout: checkoutClient },
    req
  } = ctx
  
  const body:BasketItemRequest[] = await json(req);

  console.log("body", body)
  console.info('Received code:', basketId)

  const statusResponseNewOrderFrom = await checkoutClient.newOrderForm();
  
  if(!statusResponseNewOrderFrom) {
    throw new ResolverError('Server could not create the orderForm')
  }

  const {
    data: {
      orderFormId
    }
  } = statusResponseNewOrderFrom;

  const items = convertBasketItem(body);

  const statusResponseAddItem = await checkoutClient.addItem(orderFormId, items);

  console.log(statusResponseAddItem);
  ctx.body = convertBasketResponse(statusResponseAddItem);
  //  ctx.body = statusResponseAddItem;
  
  // const {
  //   headers,
  //   data,
  //   status: responseStatus,
  // } = await statusClient.getStatusWithHeaders(code)

  // console.info('Status headers', headers)
  // console.info('Status data:', data)

  // ctx.status = responseStatus
  // ctx.body = data
  // ctx.set('Cache-Control', headers['cache-control'])

  await next()
}
