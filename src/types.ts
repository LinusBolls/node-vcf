type VCardJson = any[];

interface IVCard {
  version: string;
  data: { [key: string]: IProperty };
}
interface IProperty {
  _data: any;
  _field: any;

  fromJson: (data: VCardJson) => IProperty;
  is: (type: string) => boolean;
  isEmpty: () => boolean;
  clone: () => IProperty;
  toString: (version: string) => string;
  valueOf: () => string;
  toJson: () => VCardJson;
}
type IJCard = any[];
type IParams = { [key: string]: any };

type val = string | IProperty;

export type { IVCard, IProperty, IJCard, IParams, val };
