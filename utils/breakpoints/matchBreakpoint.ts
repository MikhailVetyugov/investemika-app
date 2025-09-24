type TBreakpoint = '--breakpoint-xl' | '--breakpoint-lg' | '--breakpoint-md' | '--breakpoint-sm';

export function matchBreakpoint(breakpoint: TBreakpoint) {
  const styles = getComputedStyle(document.documentElement);
  const breakpointValue = styles.getPropertyValue(breakpoint);

  return window.matchMedia(`(width >= ${breakpointValue})`);
}
