/* eslint-disable no-unused-vars */
import {
  IOContext,
  MetricsAccumulator,
  SegmentData,
  ServiceContext,
  RecorderState
} from "@vtex/api";

import { Clients } from "./clients";

if (!global.metrics) {
  console.error("No global.metrics at require time");
  global.metrics = new MetricsAccumulator();
}

declare global {
  type Context = ServiceContext<Clients, State>;

  type BasketItemRequest = {
    id: string;
    quantity: number;
  };

  type BasketItemResponse = {
    id: string;
    quantity: number;
    price: number;
    listPrice: number;
  };

  type Params = string | string[];

  interface State extends RecorderState {
    basketId: string;
    itemId: string;
    catalogId: number;
  }

  interface CustomContext {
    cookie: string;
    originalPath: string;
    vtex: CustomIOContext;
  }

  interface CustomIOContext extends IOContext {
    currentProfile: CurrentProfile;
    segment?: SegmentData;
    orderFormId?: string;
  }

  interface UserAddress {
    id: string;
    addressName: string;
  }

  interface UserProfile {
    id: string;
  }

  interface CurrentProfile {
    email: string;
    userId: string;
  }

  interface Item {
    thumb: string;
    name: string;
    href: string;
    criteria: string;
    slug: string;
  }

  interface OrderFormItem {
    id: string;
    name: string;
    detailUrl: string;
    imageUrl: string;
    productRefId: string;
    skuName: string;
    quantity: number;
    uniqueId: string;
    productId: string;
    refId: string;
    ean: string;
    priceValidUntil: string;
    price: number;
    tax: number;
    listPrice: number;
    sellingPrice: number;
    rewardValue: number;
    isGift: boolean;
    parentItemIndex: number | null;
    parentAssemblyBinding: string | null;
    productCategoryIds: string;
    priceTags: string[];
    measurementUnit: string;
    additionalInfo: {
      brandName: string;
      brandId: string;
      offeringInfo: any | null;
      offeringType: any | null;
      offeringTypeId: any | null;
    };
    productCategories: Record<string, string>;
    seller: string;
    sellerChain: string[];
    availability: string;
    unitMultiplier: number;
  }
  interface OrderForm {
    orderFormId: string;
    salesChannel: string;
    loggedIn: boolean;
    isCheckedIn: boolean;
    storeId: string | null;
    checkedInPickupPointId: string | null;
    allowManualPrice: boolean;
    canEditData: boolean;
    userProfileId: string | null;
    userType: string | null;
    ignoreProfileData: boolean;
    value: number;
    messages: any[];
    items: OrderFormItem[];
    selectableGifts: any[];
    totalizers: Array<{ id: string; name: string; value: number }>;
    sellers: Array<{
      id: string;
      name: string;
      logo: string;
    }>;
    storePreferencesData: {
      countryCode: string;
      saveUserData: boolean;
      timeZone: string;
      currencyCode: string;
      currencyLocale: number;
      currencySymbol: string;
      currencyFormatInfo: {
        currencyDecimalDigits: number;
        currencyDecimalSeparator: string;
        currencyGroupSeparator: string;
        currencyGroupSize: number;
        startsWithCurrencySymbol: boolean;
      };
    };
    giftRegistryData: any | null;
    openTextField: any | null;
    invoiceData: any | null;
    customData: any | null;
    hooksData: any | null;
    ratesAndBenefitsData: {
      rateAndBenefitsIdentifiers: any[];
      teaser: any[];
    };
    subscriptionData: any | null;
    itemsOrdination: any | null;
  }
  interface SKU {
    itemId: string;
    name: string;
    nameComplete: string;
    productName: string;
    productDescription: string;
    brandName: string;
    variations: [Property];
    skuSpecifications: [SkuSpecification];
    productSpecifications: [ProductSpecification];
  }

  interface Property {
    name: string;
    values: [string];
  }

  interface SkuSpecification {
    fieldName: string;
    fieldValues: string[];
  }

  interface ProductSpecification {
    fieldName: string;
    fieldValues: string[];
  }

  interface Reference {
    Key: string;
    Value: string;
  }
}
