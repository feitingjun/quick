import { useActionState, startTransition } from 'react';

// src/hooks/use-async-action.ts
function useAsyncAction(dispatch) {
  const [_, action, loading] = useActionState(
    (_2, payload) => dispatch(payload),
    void 0
  );
  return [(values) => startTransition(() => action(values)), loading];
}

export { useAsyncAction as default };
//# sourceMappingURL=use-async-action.js.map
//# sourceMappingURL=use-async-action.js.map