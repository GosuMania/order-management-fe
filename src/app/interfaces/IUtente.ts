import {IAgenzia} from "./IAgenzia";

export interface IUtente {
  id?: number;
  uid?: string;
  email: string;
  username: string;
  password?: string;
  typeAccount: string;
  agency: string;
  agencyObj?: IAgenzia; // poi vediamo se serve
}
