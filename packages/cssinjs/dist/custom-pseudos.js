// src/custom-pseudos.ts
var customPseudos = {
  _hover: ":hover",
  _active: ":active",
  _focus: ":focus",
  _focusVisible: ":focus-visible",
  _focusWithin: ":focus-within",
  _visited: ":visited",
  _link: ":link",
  _checked: ":checked",
  _readonly: ":readonly",
  _readWrite: ":read-write",
  _disabled: ":disabled",
  _before: "::before",
  _after: "::after"
};
var isCustomPseudo = (key) => key in customPseudos;
export {
  customPseudos,
  isCustomPseudo
};
