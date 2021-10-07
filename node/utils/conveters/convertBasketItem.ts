import * as config from "../../config/global.json";

export default (basketItems: BasketItemRequest[]) =>
  basketItems.map(basketItem => ({
    id: basketItem.id,
    quantity: basketItem.quantity,
    seller: config.seller
  }));
