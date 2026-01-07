import { TBreakpoint } from "@/types/breakpoint";

export function matchBreakpoint(breakpoint: TBreakpoint) {
  const styles = getComputedStyle(document.documentElement);
  const breakpointValue = styles.getPropertyValue(breakpoint);

  return window.matchMedia(`(width >= ${breakpointValue})`);
}
