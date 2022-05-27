import foldLine from "foldline";

import Property from "./property";

import parseLines from "./parse-lines";

type Params = { [key: string]: any };
type JCard = any[];

/**
 * vCard
 */
function vCard() {
  if (!(this instanceof vCard)) return vCard();

  /** @type {String} Version number */
  this.version = vCard.versions[vCard.versions.length - 1];
  /** @type {Object} Card data */
  this.data = {};
}

/**
 * vCard MIME type
 */
vCard.mimeType = "text/vcard";

/**
 * vCard file extension
 */
vCard.extension = ".vcf";

/**
 * vCard versions
 */
vCard.versions = ["2.1", "3.0", "4.0"];

/**
 * VCF EOL character sequence
 */
vCard.EOL = "\r\n";

/**
 * Folds a long line according to the RFC 5322.
 * @see http://tools.ietf.org/html/rfc5322#section-2.1.1
 * @param  {String}  input
 * @param  {Number}  maxLength
 * @param  {Boolean} hardWrap
 * @return {String}
 */
vCard.foldLine = foldLine;

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
vCard.parse = function (value: String | Buffer): typeof vCard[] {
  const objects = (value + "").split(/(?=BEGIN\:VCARD)/gi);

  const cards = objects.map(vCard().parse);

  return cards;
};

/**
 * Parse an array of vcf formatted lines
 */
vCard.parseLines = parseLines;

/**
 * Constructs a vCard from jCard data
 */
vCard.fromJSON = function (jcard: JCard): typeof vCard {
  jcard = typeof jcard === "string" ? JSON.parse(jcard) : jcard;

  if (jcard == null || !Array.isArray(jcard)) return vCard();

  if (!/vcard/i.test(jcard[0])) throw new Error("Object not in jCard format");

  const card = vCard();

  jcard[1].forEach(function (prop) {
    card.addProperty(vCard.Property.fromJSON(prop));
  });

  return card;
};

/**
 * Format a card object according to the given version
 */
vCard.format = function (card: typeof vCard, version: string): string {
  version =
    version || card.version || vCard.versions[vCard.versions.length - 1];

  if (!vCard.isSupported(version))
    throw new Error('Unsupported vCard version "' + version + '"');

  const vcf = [];

  vcf.push("BEGIN:VCARD");
  vcf.push("VERSION:" + version);

  const props = Object.keys(card.data);

  for (let prop of props) {
    if (prop === "version") continue;

    prop = card.data[prop];

    if (Array.isArray(prop)) {
      for (let k = 0; k < prop.length; k++) {
        if (prop[k].isEmpty()) continue;
        vcf.push(vCard.foldLine(prop[k].toString(version), 75));
      }
    } else if (!prop.isEmpty()) {
      vcf.push(vCard.foldLine(prop.toString(version), 75));
    }
  }
  vcf.push("END:VCARD");

  return vcf.join(vCard.EOL);
};

// vCard Property constructor
vCard.Property = Property;

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
  set: function (key: string, value: string, params: Params) {
    return this.setProperty(vCard.Property(key, value, params));
  },

  /**
   * Add a vCard property
   */
  add: function (key: string, value: string, params: Params) {
    const prop = vCard.Property(key, value, params);
    this.addProperty(prop);
    return this;
  },

  /**
   * Set a vCard property from an already
   * constructed vCard.Property
   * @param {vCard.Property} prop
   */
  setProperty: function (prop) {
    this.data[prop._field] = prop;
    return this;
  },

  /**
   * Add a vCard property from an already
   * constructed vCard.Property
   */
  addProperty: function (prop: typeof Property) {
    const key = prop._field;

    if (Array.isArray(this.data[key])) {
      this.data[key].push(prop);
    } else if (this.data[key] != null) {
      this.data[key] = [this.data[key], prop];
    } else {
      this.data[key] = prop;
    }

    return this;
  },

  /**
   * Parse a vcf formatted vCard
   */
  parse: function (value: string): typeof vCard {
    // Normalize & split
    const lines = vCard.normalize(value).split(/\r\n/g);

    // Keep begin and end markers
    // for eventual error messages
    const begin = lines[0];
    let version = lines[1];
    const end = lines[lines.length - 1];

    // Multiple used RegExp's
    const regexp_version = /VERSION:\d\.\d/i;

    if (!/BEGIN:VCARD/i.test(begin))
      throw new SyntaxError(
        'Invalid vCard: Expected "BEGIN:VCARD" but found "' + begin + '"'
      );

    if (!/END:VCARD/i.test(end))
      throw new SyntaxError(
        'Invalid vCard: Expected "END:VCARD" but found "' + end + '"'
      );

    if (!regexp_version.test(version)) {
      // VERSION mostly follows BEGIN, but it has only mandatory follow BEGIN, for version 4.0
      // Let's do the more expensive lookup for the lesser used version constiant
      if (!(version = lines.find((line) => regexp_version.test(line))))
        throw new SyntaxError(
          'Invalid vCard: Expected "VERSION:\\d.\\d" but none found'
        );
      // TODO: Do we need to throw an error if version = 4.0 or != 3.0|2.1? (because not followed BEGIN)?
    }

    this.version = version.substring(8, 11);

    if (!vCard.isSupported(this.version))
      throw new Error('Unsupported version "' + this.version + '"');

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
  toJCard: function (version: string): JCard {
    version = version || "4.0";

    const keys = Object.keys(this.data);
    const data = [["version", {}, "text", version]];
    let prop = null;

    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === "version") continue;
      prop = this.data[keys[i]];
      if (Array.isArray(prop)) {
        for (let k = 0; k < prop.length; k++) {
          data.push(prop[k].toJSON());
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
  toJSON: function (): JCard {
    return this.toJCard(this.version);
  },
};
export default vCard;
