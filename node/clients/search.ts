import {
  JanusClient,
  InstanceOptions,
  IOContext,
  RequestConfig,
  SegmentData
} from "@vtex/api";

import { stringify } from "qs";

import {
  SearchArgs,
  SearchProduct,
  CategoryTreeResponse,
  CategoryByIdResponse
} from "../typings/clients";
import { searchEncodeURI } from "../utils/search";

const inflightKey = ({ baseURL, url, params, headers }: RequestConfig) =>
  `${
    baseURL! +
    url! +
    stringify(params, { arrayFormat: "repeat", addQueryPrefix: true })
  }&segmentToken=${headers["x-vtex-segment"]}`;

export default class Search extends JanusClient {
  // eslint-disable-next-line no-unused-vars
  private searchEncodeURI: (account: string) => string;

  private base = "api/catalog_system/";

  private addCompleteSpecifications = (url: string) => {
    if (!url.includes("?")) {
      return `${url}?compSpecs=true`;
    }

    return `${url}&compSpecs=true`;
  };

  private get routes() {
    const base = "api/catalog_system/";
    return {
      products: (args: SearchArgs) => this.productSearchUrl(args),
      categories: (treeLevel: number) =>
        `${base}/pub/category/tree/${treeLevel}/`,
      getCategoryChildren: (id: number) =>
        `${base}/pub/category/categories/children?id=${id}`,
      category: (id: string | number) => `${base}/pub/category/${id}`
    };
  }

  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        ...(ctx.storeUserAuthToken
          ? { VtexIdclientAutCookie: ctx.storeUserAuthToken }
          : null),
        "x-vtex-user-agent": ctx.userAgent
      }
    });
    this.searchEncodeURI = searchEncodeURI(ctx.account);
  }

  public products = (args: SearchArgs) =>
    this.get<SearchProduct[]>(this.routes.products(args), {
      metric: "search-products"
    });

  public categories = (treeLevel: number) =>
    this.get<CategoryTreeResponse[]>(this.routes.categories(treeLevel), {
      metric: "search-categories"
    });

  public getCategoryChildren = (id: number) =>
    this.get<Record<string, string>>(this.routes.getCategoryChildren(id), {
      metric: "search-category-children"
    });

  public category = (id: string | number) =>
    this.get<CategoryByIdResponse>(this.routes.category(id), {
      metric: "search-category"
    });

  private get = <T = any>(url: string, config: RequestConfig = {}) => {
    const segmentData: SegmentData | undefined = (this
      .context! as CustomIOContext).segment;
    const { channel: salesChannel = "" } = segmentData || {};

    config.params = {
      ...config.params,
      ...(!!salesChannel && { sc: salesChannel })
    };
    config.inflightKey = inflightKey;

    return this.http.get<T>(`${url}`, config);
  };

  private productSearchUrl = ({
    query = "",
    category = "",
    orderBy = "",
    from = 0,
    to = 9,
    map = "",
    completeSpecifications = true
  }: SearchArgs) => {
    const sanitizedQuery = encodeURIComponent(
      this.searchEncodeURI(decodeURIComponent(query || "").trim())
    );
    let url = `${this.base}/pub/products/search/${sanitizedQuery}?`;
    if (category && !query) {
      url += `&fq=C:/${category}/`;
    }
    if (orderBy) {
      url += `&O=${orderBy}`;
    }
    if (map) {
      url += `&map=${map}`;
    }
    if (from != null && from > -1) {
      url += `&_from=${from}`;
    }
    if (to != null && to > -1) {
      url += `&_to=${to}`;
    }
    if (completeSpecifications) {
      url = this.addCompleteSpecifications(url);
    }
    return url;
  };
}
