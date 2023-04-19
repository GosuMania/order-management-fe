import {IUser} from "./IUser";
import {ICustomer, IMeta} from "./ICustomer";
import {IProduct} from "./IProduct";
import {ISeason, ISeasonType} from "./ISeason";
import {ISimplePickList} from "./ISimplePickList";

export interface IOrder {
  id: number;
  user?: IUser;
  cliente?: ICustomer;
  productList: IProduct[];
  idUser: number;
  descUser?: string;
  idCustomer: number;
  descCustomer?: string;
  idOrderType: string;
  descOrderType?: string;
  idPaymentMethods: number;
  descPaymentMethods?: string;
  idSeason: number;
  descSeason?: string;
  idDelivery: number;
  descDelivery?: string;
  totalPieces: number;
  totalAmount: number;
  date: string;
}

export interface IOrderPagination {
  meta: IMeta,
  data: IOrder[]
}
