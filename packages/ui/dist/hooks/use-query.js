import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import Bignumber from 'bignumber.js';

// src/hooks/use-query.ts
function isNumber(num) {
  const n = new Bignumber(num);
  return n.isFinite() && !n.isNaN();
}

// src/hooks/use-query.ts
function useQuery() {
  const [query] = useSearchParams();
  return useMemo(
    () => query.entries().reduce((acc, [key, value]) => {
      if (value === "undefined") {
        acc[key] = void 0;
      } else if (value === "null") {
        acc[key] = null;
      } else if (value.length <= 16 && isNumber(value)) {
        acc[key] = Number(value);
      } else if (value.includes(",")) {
        acc[key] = value.split(",").map((item) => isNumber(item) ? Number(item) : item);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {}),
    [query]
  );
}

export { useQuery as default };
//# sourceMappingURL=use-query.js.map
//# sourceMappingURL=use-query.js.map