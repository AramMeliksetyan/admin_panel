import { useCallback, useRef, useEffect } from "react";

/**
 * Returns a debounced version of the callback. The callback is invoked
 * after `delay` ms have passed since the last call.
 */
export function useDebouncedCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number
): (...args: A) => void {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<A | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args: A) => {
      lastArgsRef.current = args;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        const argsToUse = lastArgsRef.current;
        if (argsToUse !== undefined) {
          callbackRef.current(...argsToUse);
        }
      }, delay);
    },
    [delay]
  );
}
