import camelCase from "camelcase";

import Property from "./property";

type val = string | typeof Property;

function set(object: { [key: string]: val | val[] }, key: string, value: val) {
  if (Array.isArray(object[key])) {
    (object[key] as val[]).push(value);
    return;
  }
  if (object[key] != null) {
    object[key] = [object[key] as val, value];
    return;
  }
  object[key] = value;
}

function createParams(params, param) {
  const parts = param.split("=");
  let k = camelCase(parts[0]);
  let value = parts[1];

  if (value == null || value === "") {
    value = parts[0];
    k = "type";
  }
  if (k === "type") {
    if (value.startsWith('"') && value.endsWith('"') && value.includes(","))
      value = value.slice(1, -1);

    value
      .toLowerCase()
      .split(",")
      .forEach((value: string) => {
        set(params, k, value);
      });
    return params;
  }
  set(params, k, value);

  return params;
}

function parseLines(lines: any[]) {
  const data = {};

  // NOTE: Line format:
  //  PROPERTY[;PARAMETER[=VALUE]]:Attribute[;Attribute]

  const pattern = /^([^;:]+)((?:;(?:[^;:]+))*)(?:\:([\s\S]+))?$/i;

  for (const line of lines) {
    const match = pattern.exec(line);

    if (!match) continue;

    const name = match[1].split(".");
    const property = name.pop();
    const group = name.pop();
    const value = match[3];
    const params = match[2] ? match[2].replace(/^;|;$/g, "").split(";") : [];

    const propParams = params.reduce(createParams, group ? { group } : {});
    const propName = camelCase(property);
    const propVal = Property(propName, value, propParams);

    set(data, propName, propVal);
  }
  return data;
}
export default parseLines;
