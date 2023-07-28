import {IMeta} from "./ICustomer";

export interface IProduct {
  id?: number | null;
  image: string | null;
  idProvider: number | null;
  descProvider?: string;
  productCode: string;
  productDesc: string;
  price: number | null;
  idProductType: number | null;
  descProductType?: string;
  colorVariants: IColorVariant[] | null;
  isAdded?: boolean;
  disableCartButton?: boolean;
}

export interface IColorVariant {
  id: number | null;
  idProductVariant?: number;
  descColor?: string;
  sizeVariants?: ISizeVariant[] | null;
  stock: number | null;
  stockOrder?: number | null;
}

export interface ISizeVariant {
  id: number | null;
  idProductVariant?: number;
  descSize?: string;
  stock: number;
  stockOrder?: number | null;
}

export interface IProductPagination {
  meta: IMeta,
  data: IProduct[]
}
