/**
 * vCard Property
 */
function Property(field: string, value = "", params = null): typeof Property {
  if (!(this instanceof Property)) return Property(value);

  if (params != null) Object.assign(this, params);

  this._field = field;
  this._data = value;

  Object.defineProperty(this, "_field", { enumerable: false });
  Object.defineProperty(this, "_data", { enumerable: false });
}

/**
 * Constructs a vCard.Property from jCard data
 */
Property.fromJSON = function (data: any[]): typeof Property {
  const field = data[0];
  const params = data[1];

  if (!/text/i.test(data[2])) params.value = data[2];

  const value = Array.isArray(data[3]) ? data[3].join(";") : data[3];

  return Property(field, value, params);
};

/**
 * Turn a string into capitalized dash-case
 */
function capitalDashCase(value: string): string {
  return value.replace(/([A-Z])/g, "-$1").toUpperCase();
}

/**
 * Property prototype
 */
Property.prototype = {
  constructor: Property,

  /**
   * Check whether the property is of a given type
   */
  is: function (type: string): boolean {
    type = (type + "").toLowerCase();
    return Array.isArray(this.type)
      ? this.type.indexOf(type) >= 0
      : this.type === type;
  },

  /**
   * Check whether the property is empty
   */
  isEmpty: function (): boolean {
    return this._data == null && Object.keys(this).length === 0;
  },

  /**
   * Clone the property
   */
  clone: function (): typeof Property {
    return Property(this._field, this._data, this);
  },

  /**
   * Format the property as vcf with given version
   */
  toString: function (version: string): string {
    const propName =
      (this.group ? this.group + "." : "") + capitalDashCase(this._field);
    const keys = Object.keys(this);
    const params = [];

    for (const key of keys) {
      if (key === "group") continue;

      switch (propName) {
        case "TEL":
        case "ADR":
        case "EMAIL":
          if (version === "2.1") {
            if (Array.isArray(this[key])) params.push(this[key].join(";"));
            else params.push(this[key]);
          } else params.push(capitalDashCase(key) + "=" + this[key]);
          break;
        default:
          params.push(capitalDashCase(key) + "=" + this[key]);
      }
    }

    if (version === "2.1" || version === "3.0")
      return (
        propName +
        (params.length
          ? ";" + params.join(";").toUpperCase()
          : params.toString().toUpperCase()) +
        ":" +
        (Array.isArray(this._data) ? this._data.join(";") : this._data)
      );
    else
      return (
        propName +
        (params.length ? ";" + params.join(";") : params) +
        ":" +
        (Array.isArray(this._data) ? this._data.join(";") : this._data)
      );
  },

  /**
   * Get the property's value
   */
  valueOf: function (): string {
    return this._data;
  },

  /**
   * Format the property as jCard data
   */
  toJSON: function (): any[] {
    const params = Object.assign({}, this);

    if (params.value === "text") {
      params.value = void 0;
      delete params.value;
    }
    const data = [this._field, params, this.value || "text"];

    switch (this._field) {
      default:
        data.push(this._data);
        break;
      case "adr":
      case "n":
        data.push(this._data.split(";"));
    }
    return data;
  },
};
export default Property;
