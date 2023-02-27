import {IMeta} from "./ICustomer";

export interface IProduct {
  id?: number | null;
  immagine: string;
  idFornitore: number;
  descFornitore?: string;
  codiceArticolo: string;
  descrizioneArticolo: string;
  prezzo: number;
  idType: number;
  descType?: string;
  colorVariants: IColorVariant[] | null;
}

export interface IColorVariant {
  id: number | null;
  descColor?: string;
  sizeVariant?: ISizeVariant[] | null;
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
