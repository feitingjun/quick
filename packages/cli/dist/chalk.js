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
export {
  chalk
};
