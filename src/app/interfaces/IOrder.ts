import {IUser} from "./IUser";
import {ICustomer} from "./ICustomer";
import {IProduct} from "./IProduct";
import {ISeason, ISeasonType} from "./ISeason";
import {ISimplePickList} from "./ISimplePickList";

export interface IOrder {
  numeroOrdine: number;
  utente: IUser;
  cliente: ICustomer;
  listaArticoli: IProduct[];
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
  orderDate: string;
}
