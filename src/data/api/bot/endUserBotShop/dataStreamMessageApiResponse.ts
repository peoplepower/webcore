export enum DataStreamScope {
  Individual = 1,
  OrgLocational = 2,
  Circle = 4,
}

export interface DataStreamMessage {
  locations?: number[];
  bots?: number[];
  feed?: {
    [key: string]: string;
  };
}
