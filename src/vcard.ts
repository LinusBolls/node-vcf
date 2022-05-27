import foldLine from "foldline";

import Property from "./property";

import parseLines from "./parse-lines";

import type { IParams, IProperty, IVCard, IJCard } from "./types";

/**
 * vCard
 */
function vCard(): void {
  if (!(this instanceof vCard)) return new vCard();

  const [lastVersion] = vCard.versions.slice(-1);

  this.version = lastVersion;
  this.data = {};
}
vCard.mimeType = "text/vcard";
vCard.extension = ".vcf";
vCard.versions = ["2.1", "3.0", "4.0"];
vCard.EOL = "\r\n";

/**
 * Folds a long line according to the RFC 5322.
 * @see http://tools.ietf.org/html/rfc5322#section-2.1.1
 */
vCard.foldLine = foldLine;
vCard.Property = Property;
vCard.parseLines = parseLines;

/**
 * Normalizes input (cast to string, line folding, whitespace)
 */
vCard.normalize = function (input: string): string {
  return (
    (input + "")
      // Trim whitespace
      .replace(/^[\s\r\n]+|[\s\r\n]+$/g, "")
      // Trim blank lines
      .replace(/(\r\n)[\x09\x20]?(\r\n)|$/g, "$1")
      // Unfold folded lines
      .replace(/\r\n[\x20\x09]/g, "")
  );
};

/**
 * Check whether a given version is supported
 */
vCard.isSupported = function (version: string): boolean {
  return /^\d\.\d$/.test(version) && vCard.versions.indexOf(version) !== -1;
};

/**
 * Parses a string or buffer into a vCard object
 */
vCard.parse = function (value: String | Buffer): IVCard[] {
  const objects = value.toString().split(/(?=BEGIN\:VCARD)/gi);

  let cards = [];

  for (const obj of objects) {
    cards.push(new vCard().parse(obj));
  }
  return cards;
};

/**
 * Constructs a vCard from jCard data
 */
vCard.fromJSON = function (jcard: IJCard): IVCard {
  jcard = typeof jcard === "string" ? JSON.parse(jcard) : jcard;

  if (jcard == null || !Array.isArray(jcard)) return new vCard();

  if (!/vcard/i.test(jcard[0])) throw new Error("Object not in jCard format");

  const card = new vCard();

  for (const prop of jcard[1]) {
    card.addProperty(vCard.Property.fromJSON(prop));
  }
  return card;
};

/**
 * Format a card object according to the given version
 */
vCard.format = function (card: IVCard, version: string): string {
  version =
    version || card.version || vCard.versions[vCard.versions.length - 1];

  if (!vCard.isSupported(version))
    throw new Error(`Unsupported vCard version "${version}"`);

  const vcf = [];

  vcf.push("BEGIN:VCARD");
  vcf.push("VERSION:" + version);

  const props = Object.keys(card.data);

  for (let prop of props) {
    if (prop === "version") continue;

    const prevProp: IProperty = card.data[prop];

    if (Array.isArray(prevProp)) {
      for (const ding of prevProp) {
        if (ding.isEmpty()) continue;

        vcf.push(vCard.foldLine(ding.toString(version), 75, false));
      }
    } else if (!prevProp.isEmpty()) {
      vcf.push(vCard.foldLine(prevProp.toString(version), 75, false));
    }
  }
  vcf.push("END:VCARD");

  return vcf.join(vCard.EOL);
};

/**
 * vCard prototype
 * @type {Object}
 */
vCard.prototype = {
  constructor: vCard,

  /**
   * Get a vCard property
   */
  get: function (key: string): any[] | { [key: string]: any } {
    if (this.data[key] == null) {
      return this.data[key];
    }

    if (Array.isArray(this.data[key])) {
      return this.data[key].map(function (prop) {
        return prop.clone();
      });
    } else {
      return this.data[key].clone();
    }
  },

  /**
   * Set a vCard property
   */
  set: function (key: string, value: string, params: IParams) {
    return this.setProperty(new vCard.Property(key, value, params));
  },

  /**
   * Add a vCard property
   */
  add: function (key: string, value: string, params: IParams) {
    const prop = new vCard.Property(key, value, params);
    this.addProperty(prop);
    return this;
  },

  /**
   * Set a vCard property from an already
   * constructed vCard.Property
   */
  setProperty: function (prop: IProperty) {
    this.data[prop._field] = prop;

    return this;
  },

  /**
   * Add a vCard property from an already
   * constructed vCard.Property
   */
  addProperty: function (prop: IProperty) {
    const key = prop._field;

    if (Array.isArray(this.data[key])) {
      this.data[key].push(prop);

      return this;
    }
    if (this.data[key] != null) {
      this.data[key] = [this.data[key], prop];

      return this;
    }
    this.data[key] = prop;

    return this;
  },

  /**
   * Parse a vcf formatted vCard
   */
  parse: function (value: string): IVCard {
    // Normalize & split
    const lines = vCard.normalize(value).split(/\r\n/g);
    const version = getVersion(lines);

    // Keep begin and end markers for eventual error messages
    const begin = lines[0];
    const end = lines[lines.length - 1];

    if (!/BEGIN:VCARD/i.test(begin))
      throw new SyntaxError(
        `Invalid vCard: Expected "BEGIN:VCARD" but found "${begin}"`
      );

    if (!/END:VCARD/i.test(end))
      throw new SyntaxError(
        `Invalid vCard: Expected "END:VCARD" but found "${end}"`
      );

    if (version == null)
      throw new SyntaxError(
        `Invalid vCard: Expected "VERSION:\\d.\\d" but none found`
      );

    // fails on parse multiple vCards from one file bc this is undefined

    if (this == null) console.log("this is undefined!!!");

    this.version = version.substring(8, 11);

    if (!vCard.isSupported(this.version))
      throw new Error(`Unsupported vCard version "${this.version}"`);

    this.data = vCard.parseLines(lines);

    return this;
  },

  /**
   * Format the vCard as vcf with given version
   */
  toString: function (version: string, charset: string): string {
    version = version || this.version;
    return vCard.format(this, version);
  },

  /**
   * Format the card as jCard
   */
  toJCard: function (version: string): IJCard {
    version = version || "4.0";

    const keys = Object.keys(this.data);
    const data = [["version", {}, "text", version]];

    for (const key of keys) {
      if (key === "version") continue;

      const prop = this.data[key];

      if (Array.isArray(prop)) {
        for (const k of prop) {
          data.push(k.toJSON());
        }
      } else {
        data.push(prop.toJSON());
      }
    }
    return ["vcard", data];
  },

  /**
   * Format the card as jCard
   */
  toJSON: function (): IJCard {
    return this.toJCard(this.version);
  },
};
// export default vCard;
module.exports = vCard;

function getVersion(lines: string[]): string | undefined {
  // VERSION mostly follows BEGIN, but it has only mandatory follow BEGIN, for version 4.0
  // Let's do the more expensive lookup for the lesser used version constiant

  // TODO: Do we need to throw an error if version = 4.0 or != 3.0|2.1? (because not followed BEGIN)?

  const regexp_version = /VERSION:\d\.\d/i;

  if (regexp_version.test(lines[1])) return lines[1];

  return lines.find((i) => regexp_version.test(i));
}
