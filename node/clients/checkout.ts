import {
  InstanceOptions,
  JanusClient,
  RequestConfig,
  IOResponse,
  IOContext
} from "@vtex/api";

import { checkoutCookieFormat, statusToError } from "../utils";

export default class Checkout extends JanusClient {
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
  }

  private getCommonHeaders = () => {
    const { orderFormId, segmentToken, sessionToken } = this
      .context as CustomIOContext;

    const checkoutCookie = orderFormId ? checkoutCookieFormat(orderFormId) : "";
    const segmentTokenCookie = segmentToken
      ? `vtex_segment=${segmentToken};`
      : "";

    const sessionTokenCookie = sessionToken
      ? `vtex_session=${sessionToken};`
      : "";

    return {
      Cookie: `${checkoutCookie}${segmentTokenCookie}${sessionTokenCookie}`
    };
  };

  private getChannelQueryString = () => {
    const { segment } = this.context as CustomIOContext;
    const channel = segment && segment.channel;
    const queryString = channel ? `?sc=${channel}` : "";

    return queryString;
  };

  private get routes() {
    const base = "/api/checkout/pub";

    return {
      addItem: (orderFormId: string, queryString: string) =>
        `${base}/orderForm/${orderFormId}/items${queryString}`,
      updateItems: (orderFormId: string) =>
        `${base}/orderForm/${orderFormId}/items/update`,
      orderForm: (orderFormId?: string) =>
        `${base}/orderForm/${orderFormId ?? ""}`
    };
  }

  public addItem = (orderFormId: string, items: any) =>
    this.post<OrderForm>(
      this.routes.addItem(orderFormId, this.getChannelQueryString()),
      { orderItems: items },
      { metric: "checkout-addItem" }
    );

  public updateItems = (orderFormId: string, orderItems: any) =>
    this.post<OrderForm>(
      this.routes.updateItems(orderFormId),
      { orderItems },
      { metric: "checkout-updateItems" }
    );

  public orderForm = (orderFormId?: string) =>
    this.post<OrderForm>(
      this.routes.orderForm(orderFormId),
      { expectedOrderFormSections: ["items"] },
      { metric: "checkout-orderForm" }
    );

  public newOrderForm = (orderFormId?: string) =>
    this.http
      .postRaw<OrderForm>(this.routes.orderForm(orderFormId), undefined, {
        metric: "checkout-newOrderForm"
      })
      .catch(statusToError) as Promise<IOResponse<OrderForm>>;

  protected get = <T>(url: string, config: RequestConfig = {}) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders()
    };

    return this.http.get<T>(url, config).catch(statusToError) as Promise<T>;
  };

  protected post = <T>(url: string, data?: any, config: RequestConfig = {}) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders()
    };

    return this.http
      .post<T>(url, data, config)
      .catch(statusToError) as Promise<T>;
  };

  protected postRaw = async <T>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders()
    };

    return this.http
      .postRaw<T>(url, data, config)
      .catch(statusToError) as Promise<IOResponse<T>>;
  };

  protected delete = <T>(url: string, config: RequestConfig = {}) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders()
    };

    return this.http.delete<T>(url, config).catch(statusToError) as Promise<
      IOResponse<T>
    >;
  };
}
