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
}

export interface IColorVariant {
  id: number | null;
  descColor?: string;
  sizeVariants?: ISizeVariant[] | null;
  stock: number | null;
}

export interface ISizeVariant {
  id: number | null;
  descSize?: string;
  stock: number;
}

export interface IProductPagination {
  meta: IMeta,
  data: IProduct[]
}
