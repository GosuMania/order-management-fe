import {IMeta} from "./ICustomer";

export interface IColor {
  id: number | null;
  codice?: string;
  colore: string;
}


export interface IColorPagination {
  meta: IMeta,
  data: IColor[]
}
