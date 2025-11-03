// src/hbs.ts
import { readFileSync, writeFileSync } from "fs";
import hbs from "handlebars";

// src/chalk.ts
var chalk = {
  blue: (text) => {
    return `\x1B[34m${text}\x1B[0m`;
  },
  green: (text) => {
    return `\x1B[32m${text}\x1B[0m`;
  },
  red: (text) => {
    return `\x1B[31m${text}\x1B[0m`;
  }
};

// src/hbs.ts
hbs.registerHelper("isArray", function(value, options) {
  return hbs.Utils.isArray(value) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("isString", function(value, options) {
  return typeof value === "string" ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("isEqual", function(value1, value2) {
  return value1 === value2;
});
hbs.registerHelper("and", function(value1, value2) {
  return value1 && value2;
});
hbs.registerHelper("or", function(value1, value2) {
  return value1 || value2;
});
hbs.registerHelper("rmTsx", function(value) {
  return value.replace(/\.tsx$/, "");
});
hbs.registerHelper("boolean", function(value) {
  return !!value;
});
hbs.registerHelper("repeat", function(num, str) {
  return str.repeat(num);
});
hbs.registerHelper("space", function(value) {
  if (typeof value !== "number") {
    value = 1;
  }
  return " ".repeat(value);
});
var renderHbsTpl = ({
  sourcePath,
  outPath,
  data = {}
}) => {
  const rendered = hbs.compile(readFileSync(sourcePath, "utf-8"))(data);
  if (rendered) {
    writeFileSync(outPath, rendered);
  } else {
    console.log(chalk.red(`\u52A0\u8F7D\u6A21\u677F\u6587\u4EF6\u5931\u8D25: ${sourcePath}`));
  }
};
export {
  renderHbsTpl
};
