import Bignumber from 'bignumber.js';

// src/utils/numbers.ts
function thousands(num) {
  if (!isNumber(num)) return num;
  const arr = String(num).split(".");
  const intPart = arr[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  return arr[1] ? `${intPart}.${arr[1]}` : intPart;
}
function toFixed(num, n = 2) {
  return new Bignumber(num).toFixed(n);
}
function round(num, n = 2) {
  return new Bignumber(num).decimalPlaces(n, Bignumber.ROUND_HALF_UP).toNumber();
}
function zerofill(num, n = 2) {
  const [intPart, decPart = ""] = String(num).split(".");
  if (decPart.length >= n) return num;
  const filledDec = decPart.padEnd(n, "0").slice(0, n);
  return `${intPart}.${filledDec}`;
}
function toPercent(num) {
  return multiply(num, 100) + "%";
}
function isNumber(num) {
  const n = new Bignumber(num);
  return n.isFinite() && !n.isNaN();
}
function multiply(a, b) {
  return new Bignumber(a).times(b).toNumber();
}
function divide(a, b) {
  return new Bignumber(a).div(b).toNumber();
}
function add(a, b) {
  return new Bignumber(a).plus(b).toNumber();
}
function subtract(a, b) {
  return new Bignumber(a).minus(b).toNumber();
}
function mod(a, b) {
  return new Bignumber(a).mod(b).toNumber();
}

export { add, divide, isNumber, mod, multiply, round, subtract, thousands, toFixed, toPercent, zerofill };
//# sourceMappingURL=numbers.js.map
//# sourceMappingURL=numbers.js.map