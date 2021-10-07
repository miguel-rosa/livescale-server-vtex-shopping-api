import { IOClients } from "@vtex/api";

import Checkout from "./checkout";
import Search from "./search";

export class Clients extends IOClients {
  public get checkout() {
    return this.getOrSet("checkout", Checkout);
  }

  public get search() {
    return this.getOrSet("search", Search);
  }
}
