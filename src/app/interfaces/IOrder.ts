import {IUser} from "./IUser";
import {ICustomer, IMeta} from "./ICustomer";
import {IProduct} from "./IProduct";
import {ISeason, ISeasonType} from "./ISeason";
import {ISimplePickList} from "./ISimplePickList";

export interface IOrder {
  id: number | null;
  user?: IUser | null;
  cliente?: ICustomer | null;
  productList: IProduct[];
  productListBK?: IProduct[];
  idUser: number | undefined;
  descUser?: string;
  idCustomer: number | null;
  descCustomer?: string;
  idOrderType: number | null;
  descOrderType?: string;
  idPaymentMethods: number | null;
  descPaymentMethods?: string;
  idSeason: number | null;
  descSeason?: string;
  idDelivery: number | null;
  descDelivery?: string;
  totalPieces: number;
  totalAmount: number;
  status: string;
  date?: string;
}

export interface IOrderPagination {
  meta: IMeta,
  data: IOrder[]
}
