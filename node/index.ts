import type { ClientsConfig } from "@vtex/api";
import { LRUCache, method, Service } from "@vtex/api";

import { Clients } from "./clients";
import { validateBasketId } from "./middlewares/validateBasketId";
import { validateItemId } from "./middlewares/validateItemId";
import Baskets from "./middlewares/baskets";

const TIMEOUT_MS = 8000;

const memoryCache = new LRUCache<string, any>({ max: 5000 });

metrics.trackCache("status", memoryCache);

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS
    },
    status: {
      memoryCache
    }
  }
};

const baskets = new Baskets();

export default new Service({
  clients,
  routes: {
    createBaskets: method({
      POST: baskets.create
    }),
    updateBaskets: method({
      POST: [validateBasketId, baskets.update]
    }),
    updateItemBaskets: method({
      PUT: [validateBasketId, validateItemId, baskets.updateItem],
      DELETE: [validateBasketId, validateItemId, baskets.deleteItem]
    })
  }
});
