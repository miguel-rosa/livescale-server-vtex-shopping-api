export interface SearchArgs extends QueryArgs {
  category: string | null;
  specificationFilters: string[] | null;
  priceRange?: string | null;
  collection: string | null;
  salesChannel: string | null;
  orderBy: string | null;
  from: number | null;
  to: number | null;
  hideUnavailableItems: boolean | null;
  simulationBehavior: "skip" | "default" | null;
  completeSpecifications: boolean;
}

export interface CategoryByIdResponse {
  parentId: number | null;
  GlobalCategoryId: number;
  GlobalCategoryName: string;
  position: number;
  slug: string;
  id: number;
  name: string;
  hasChildren: boolean;
  url: string;
  children: null;
  Title: string;
  MetaTagDescription: string;
}
export interface SearchProduct {
  productId: string;
  productName: string;
  brand: string;
  brandId: number;
  linkText: string;
  productReference: string;
  categoryId: string;
  productTitle: string;
  metaTagDescription: string;
  clusterHighlights: Record<string, string>;
  productClusters: Record<string, string>;
  searchableClusters: Record<string, string>;
  categories: string[];
  categoriesIds: string[];
  link: string;
  description: string;
  items: SearchItem[];
  itemMetadata: {
    items: SearchMetadataItem[];
  };
  titleTag: string;
  Specifications?: string[];
  allSpecifications?: string[];
  allSpecificationsGroups?: string[];
  completeSpecifications?: CompleteSpecification[];
  skuSpecifications?: SkuSpecification[];
}

interface SelectedFacets {
  key: string;
  value: string;
}

interface QueryArgs {
  query: string;
  map?: string;
  selectedFacets?: SelectedFacets[];
}

interface CategoryTreeResponse {
  id: number;
  name: string;
  hasChildren: boolean;
  url: string;
  children: CategoryTreeResponse[];
  Title: string;
  MetaTagDescription: string;
}

interface SearchItem {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  referenceId: { Key: string; Value: string }[];
  measurementUnit: string;
  unitMultiplier: number;
  modalType: any | null;
  images: SearchImage[];
  Videos: string[];
  variations: string[];
  sellers: Seller[];
  attachments: {
    id: number;
    name: string;
    required: boolean;
    domainValues: string;
  }[];
  isKit: boolean;
  kitItems?: {
    itemId: string;
    amount: number;
  }[];
}

interface CompleteSpecification {
  Values: {
    Id: string;
    Position: number;
    Value: string;
  }[];
  Name: string;
  Position: number;
  IsOnProductDetails: boolean;
  FieldId: string;
}

interface SkuSpecification {
  field: SKUSpecificationField;
  values: SKUSpecificationValue[];
}

interface SKUSpecificationField {
  name: string;
  id: string;
}

interface SKUSpecificationValue {
  name: string;
  id: string;
  fieldId: string;
}

interface SearchImage {
  imageId: string;
  imageLabel: string | null;
  imageTag: string;
  imageUrl: string;
  imageText: string;
}

interface SearchInstallment {
  Value: number;
  InterestRate: number;
  TotalValuePlusInterestRate: number;
  NumberOfInstallments: number;
  PaymentSystemName: string;
  PaymentSystemGroupName: string;
  Name: string;
}

interface CommertialOffer {
  DeliverySlaSamplesPerRegion: Record<
    string,
    { DeliverySlaPerTypes: any[]; Region: any | null }
  >;
  Installments: SearchInstallment[];
  DiscountHighLight: any[];
  GiftSkuIds: string[];
  Teasers: any[];
  BuyTogether: any[];
  ItemMetadataAttachment: any[];
  Price: number;
  ListPrice: number;
  PriceWithoutDiscount: number;
  RewardValue: number;
  PriceValidUntil: string;
  AvailableQuantity: number;
  Tax: number;
  DeliverySlaSamples: {
    DeliverySlaPerTypes: any[];
    Region: any | null;
  }[];
  GetInfoErrorMessage: any | null;
  CacheVersionUsedToCallCheckout: string;
}

interface Seller {
  sellerId: string;
  sellerName: string;
  addToCartLink: string;
  sellerDefault: boolean;
  commertialOffer: CommertialOffer;
}

interface SearchFacetCategory {
  Id: number;
  Quantity: number;
  Name: string;
  Link: string;
  LinkEncoded: string;
  Map: string;
  Value: string;
  Children: SearchFacetCategory[];
}
