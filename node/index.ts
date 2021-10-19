import type { ClientsConfig, ParamsContext } from "@vtex/api";
import {
  // LRUCache,
  method,
  Service
} from "@vtex/api";

import { Clients } from "./clients";

import validateBasketId from "./middlewares/validateBasketId";
import validateItemId from "./middlewares/validateItemId";
import validateCatalogId from "./middlewares/validateCatalogId";
import validateCategoryId from "./middlewares/validateCategoryId";
import validateHostWhitelist from "./middlewares/validateHostWhitelist";

import Baskets from "./middlewares/baskets";
import Catalogs from "./middlewares/catalogs";
import Categories from "./middlewares/categories";
import Products from "./middlewares/products";
import SalesChannels from "./middlewares/salesChannels";

import { queries, mutations } from "./resolvers";

const TIMEOUT_MS = 800;

// const memoryCache = new LRUCache<string, any>({ max: 5000 });

// metrics.trackCache("status", memoryCache);

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 20,
      timeout: TIMEOUT_MS
    }
    // ,
    // status: {
    //   memoryCache
    // }
  }
};

const baskets = new Baskets();
const catalogs = new Catalogs();
const categories = new Categories();
const products = new Products();
const salesChannels = new SalesChannels();

export default new Service<Clients, State, ParamsContext>({
  clients,
  routes: {
    createBaskets: method({
      POST: baskets.create
    }),
    updateBaskets: method({
      POST: [validateBasketId, baskets.update]
    }),
    listBaskets: method({
      GET: [validateBasketId, baskets.show]
    }),
    updateItemBaskets: method({
      PUT: [validateBasketId, validateItemId, baskets.updateItem],
      DELETE: [validateBasketId, validateItemId, baskets.deleteItem]
    }),
    catalogsList: method({
      GET: [validateHostWhitelist, catalogs.index]
    }),
    categoriesList: method({
      GET: [validateHostWhitelist, validateCatalogId, categories.index]
    }),
    productsList: method({
      GET: [
        validateHostWhitelist,
        validateCatalogId,
        validateCategoryId,
        products.index
      ]
    }),
    salesChannelsList: method({
      GET: [validateHostWhitelist, salesChannels.index]
    })
  },
  graphql: {
    resolvers: {
      Query: {
        ...queries
      },
      Mutation: {
        ...mutations
      }
    }
  }
});
