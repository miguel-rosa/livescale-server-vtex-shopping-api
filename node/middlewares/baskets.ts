import { json } from "co-body";
import { ResolverError } from "@vtex/api";

import convertBasketItem from "../utils/conveters/convertBasketItem";
import convertBasketResponse from "../utils/conveters/convertBasketResponse";

export default class Baskets {
  public async create(ctx: Context, next: () => Promise<any>) {
    const {
      clients: { checkout: checkoutClient },
      host,
      req
    } = ctx;

    const body: BasketItemRequest[] = await json(req);

    const newOrderFrom = await checkoutClient.newOrderForm();

    if (!newOrderFrom) {
      throw new ResolverError("Server could not create the orderForm");
    }

    const {
      data: { orderFormId }
    } = newOrderFrom;

    if (Object.keys(body).length !== 0) {
      const convertedItems = convertBasketItem(body);

      const updatedOrderForm = await checkoutClient.addItem(
        orderFormId,
        convertedItems
      );

      ctx.body = convertBasketResponse(updatedOrderForm, host);
    } else {
      ctx.body = convertBasketResponse(newOrderFrom.data, host);
    }

    await next();
  }

  public async update(ctx: Context, next: () => Promise<any>) {
    const {
      state: { basketId },
      clients: { checkout: checkoutClient },
      host,
      req
    } = ctx;

    const body: BasketItemRequest[] = await json(req);

    const convertedItems = convertBasketItem(body);

    const updatedOrderForm = await checkoutClient.addItem(
      basketId,
      convertedItems
    );

    ctx.body = convertBasketResponse(updatedOrderForm, host);

    await next();
  }

  public async updateItem(ctx: Context, next: () => Promise<any>) {
    const {
      state: { basketId, itemId },
      clients: { checkout: checkoutClient },
      host,
      req
    } = ctx;

    const { quantity } = await json(req);

    const { items: orderFormItems } = await checkoutClient.orderForm(basketId);

    const updatedItems = orderFormItems
      .map((orderFormItem, index) =>
        orderFormItem.id === itemId ? { index, quantity } : null
      )
      .filter(orderFormItem => orderFormItem !== null);

    const updatedOrderForm = await checkoutClient.updateItems(
      basketId,
      updatedItems
    );

    ctx.body = convertBasketResponse(updatedOrderForm, host);

    await next();
  }

  public async deleteItem(ctx: Context, next: () => Promise<any>) {
    const {
      state: { basketId, itemId },
      clients: { checkout: checkoutClient },
      host
    } = ctx;

    const { items: orderFormItems } = await checkoutClient.orderForm(basketId);

    const updatedItems = orderFormItems
      .map((orderFormItem, index) =>
        orderFormItem.id === itemId ? { index, quantity: 0 } : null
      )
      .filter(orderFormItem => orderFormItem !== null);

    const updatedOrderForm = await checkoutClient.updateItems(
      basketId,
      updatedItems
    );

    ctx.body = convertBasketResponse(updatedOrderForm, host);

    await next();
  }

  public async show(ctx: Context, next: () => Promise<any>) {
    const {
      state: { basketId },
      clients: { checkout: checkoutClient },
      host
    } = ctx;
    const orderForm = await checkoutClient.orderForm(basketId);
    ctx.body = convertBasketResponse(orderForm, host);
    await next();
  }
}
