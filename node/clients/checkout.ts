import {
  InstanceOptions,
  JanusClient,
  RequestConfig,
  IOResponse,
  IOContext
} from "@vtex/api";
import { AxiosError } from "axios";

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

  public addItem = (orderFormId: string, items: any) =>
    this.post<OrderForm>(
      this.routes.addItem(orderFormId, this.getChannelQueryString()),
      { orderItems: items },
      { metric: "checkout-addItem" }
    );

  public updateItems = (orderFormId: string, orderItems: any) =>
    this.post(
      this.routes.updateItems(orderFormId),
      { orderItems },
      { metric: "checkout-updateItems" }
    );

  public updateOrderFormCheckin = (orderFormId: string, checkinPayload: any) =>
    this.post(this.routes.checkin(orderFormId), checkinPayload, {
      metric: "checkout-updateOrderFormCheckin"
    });

  public orderForm = (orderFormId?: string) =>
    this.post<OrderForm>(
      this.routes.orderForm(orderFormId),
      { expectedOrderFormSections: ["items"] },
      { metric: "checkout-orderForm" }
    );

  public orderFormRaw = () =>
    this.postRaw<OrderForm>(
      this.routes.orderForm(),
      { expectedOrderFormSections: ["items"] },
      { metric: "checkout-orderForm" }
    );

  public newOrderForm = (orderFormId?: string) =>
    this.http
      .postRaw<OrderForm>(this.routes.orderForm(orderFormId), undefined, {
        metric: "checkout-newOrderForm"
      })
      .catch(statusToError) as Promise<IOResponse<OrderForm>>;

  public changeToAnonymousUser = (orderFormId: string) =>
    this.get(this.routes.changeToAnonymousUser(orderFormId), {
      metric: "checkout-change-to-anonymous"
    }).catch(err => {
      // This endpoint is expected to return a redirect to
      // the user, so we can ignore the error if it is a 3xx
      if (!err.response || /^3..$/.test((err as AxiosError).code ?? "")) {
        throw err;
      }
    });

  public orders = () =>
    this.get(this.routes.orders, { metric: "checkout-orders" });

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

  protected patch = <T>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders()
    };

    return this.http
      .patch<T>(url, data, config)
      .catch(statusToError) as Promise<T>;
  };

  protected put = <T>(url: string, data?: any, config: RequestConfig = {}) => {
    config.headers = {
      ...config.headers,
      ...this.getCommonHeaders()
    };

    return this.http
      .put<T>(url, data, config)
      .catch(statusToError) as Promise<T>;
  };

  private get routes() {
    const base = "/api/checkout/pub";

    return {
      addItem: (orderFormId: string, queryString: string) =>
        `${base}/orderForm/${orderFormId}/items${queryString}`,
      cancelOrder: (orderFormId: string) =>
        `${base}/orders/${orderFormId}/user-cancel-request`,
      updateItems: (orderFormId: string) =>
        `${base}/orderForm/${orderFormId}/items/update`,
      checkin: (orderFormId: string) =>
        `${base}/orderForm/${orderFormId}/checkIn`,
      orderForm: (orderFormId?: string) =>
        `${base}/orderForm/${orderFormId ?? ""}`,
      orders: `${base}/orders`,
      changeToAnonymousUser: (orderFormId: string) =>
        `/checkout/changeToAnonymousUser/${orderFormId}`
    };
  }
}
