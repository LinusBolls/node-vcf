const { readFileSync } = require("fs");
const util = require("util");

const vCard = require("..");

const argv = process.argv.slice(2);

const inspectOptions = {
  colors: process.stdout.isTTY,
  depth: null,
};
const inspect = (value) => util.inspect(value, inspectOptions);

const filename = argv.shift();
const data = readFileSync(filename);
const card = new vCard().parse(data);

console.log(inspect(card));
