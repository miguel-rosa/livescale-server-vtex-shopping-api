export default (orderForm: any, host: string) => ({
  id: orderForm.orderFormId,
  cart_url: `https://${host}/checkout/?orderFormId=${orderForm.orderFormId}#/cart`,
  items: orderForm.items.map((basketItem: any) => ({
    sku: basketItem.id,
    quantity: basketItem.quantity,
    price: {
      amount: basketItem.price,
      compare_at_amount: undefined,
      currency: orderForm.storePreferencesData.currencyCode,
      unit: "single",
      unit_measure: "each",
      amount_per_unit: 1
    },
    discounted_price: {
      amount: basketItem.sellingPrice,
      compare_at_amount: undefined,
      currency: orderForm.storePreferencesData.currencyCode,
      unit: "single",
      unit_measure: "each",
      amount_per_unit: 1
    }
  })),
  taxation: "NET",
  sub_total: orderForm.totalizers.find(({ id }: any) => id === "Items").value,
  gift_cards_total: 0,
  discounts_total:
    orderForm.totalizers.find(({ id }: any) => id === "Discounts").value * -1,
  shipping_total: undefined,
  taxes_total: undefined,
  total: orderForm.value
});
