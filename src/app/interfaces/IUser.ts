import {IAgency} from "./IAgency";

export interface IUser {
  id?: number;
  uid?: string;
  email: string;
  username: string;
  name: string;
  password?: string;
  typeAccount: string;
  agency: string;
  agencyObj?: IAgency; // poi vediamo se serve
}
