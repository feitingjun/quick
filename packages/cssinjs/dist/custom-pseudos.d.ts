declare const customPseudos: {
    readonly _hover: ":hover";
    readonly _active: ":active";
    readonly _focus: ":focus";
    readonly _focusVisible: ":focus-visible";
    readonly _focusWithin: ":focus-within";
    readonly _visited: ":visited";
    readonly _link: ":link";
    readonly _checked: ":checked";
    readonly _readonly: ":readonly";
    readonly _readWrite: ":read-write";
    readonly _disabled: ":disabled";
    readonly _before: "::before";
    readonly _after: "::after";
};
type CustomPseudos = keyof typeof customPseudos;
declare const isCustomPseudo: (key: string) => key is CustomPseudos;

export { type CustomPseudos, customPseudos, isCustomPseudo };
