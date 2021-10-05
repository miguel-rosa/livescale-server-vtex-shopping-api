export async function status(ctx: Context, next: () => Promise<any>) {
  const {
    state: { basketId },
    clients: { checkout: checkoutClient },
    body: { items }
  } = ctx


  console.info('Received code:', basketId)

  const statusResponse = await checkoutClient.newOrderForm();

  console.log("statusResponse", statusResponse)
  console.log("items", items)

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
