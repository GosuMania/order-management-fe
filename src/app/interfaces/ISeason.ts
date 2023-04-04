export interface ISeason {
  id: number;
  tipologiaStagione: ISeasonType;
  year: string;
  period: string;
  startDate: string;
  finalDate: string;
}

export interface ISeasonType {
  id: number;
  desc: string;
}
