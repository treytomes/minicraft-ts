export type BusEvent<DetailType> = string & {
  __detail: DetailType;
};
