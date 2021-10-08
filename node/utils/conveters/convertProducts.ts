import { SearchProduct } from "../../typings/clients";

export default (products: SearchProduct[]) =>
  products.map(product => ({
    id: product.productId,
    name: product.productName,
    brand: product.brand,
    description: product.description,
    short_description: product.description,
    image: product.items[0].images[0].imageUrl,
    images: product.items
      .map(item =>
        item.images.map(image => image.imageUrl).filter(image => image)
      )
      .flat(1),
    variants: product.items.map(variation => ({
      sku: variation.itemId,
      image: variation.images[0].imageUrl,
      images: variation.images.map(item => item.imageUrl),
      price: {
        amount: variation.sellers.find(item => item.sellerDefault)
          ?.commertialOffer.Price,
        compare_at_amount: undefined,
        currency: "string",
        unit: "single",
        unit_measure: "each",
        amount_per_unit: 1
      },
      attribute_values: []
    })),
    attributes: []
  }));
