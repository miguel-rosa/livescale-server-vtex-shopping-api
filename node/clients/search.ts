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
  CategoryTreeResponse
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

  private base = "api/catalog_system";

  private addCompleteSpecifications = (url: string) => {
    if (!url.includes("?")) {
      return `${url}?compSpecs=true`;
    }

    return `${url}&compSpecs=true`;
  };

  private get routes() {
    return {
      products: (args: SearchArgs) => this.productSearchUrl(args),
      categories: (treeLevel: number) =>
        `${this.base}/pub/category/tree/${treeLevel}/`,
      salesChannels: () => `${this.base}/pvt/saleschannel/list`
    };
  }

  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        "x-vtex-user-agent": ctx.userAgent,
        VtexIdclientAutCookie: ctx.adminUserAuthToken ?? ctx.authToken ?? ""
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

  public salesChannels = () =>
    this.get(this.routes.salesChannels(), {
      metric: "sales-channels"
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
    catalogId = 0,
    categoryId = 0,
    orderBy = "",
    from = 0,
    to = 9,
    map = "",
    salesChannel = "",
    hideUnavailableItems = true,
    completeSpecifications = true
  }: SearchArgs) => {
    const sanitizedQuery = encodeURIComponent(
      this.searchEncodeURI(decodeURIComponent(query || "").trim())
    );
    if (hideUnavailableItems) {
      const segmentData = (this.context as CustomIOContext).segment;
      salesChannel = segmentData?.channel.toString() ?? "";
    }

    let url = `${this.base}/pub/products/search/${sanitizedQuery}?`;
    if (catalogId && categoryId && !query) {
      url += `&fq=C:/${catalogId}/${categoryId}`;
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
    if (salesChannel) {
      url += `&fq=isAvailablePerSalesChannel_${salesChannel}:1`;
    }
    if (completeSpecifications) {
      url = this.addCompleteSpecifications(url);
    }
    return url;
  };
}
