import { useEffect, useState } from "react";

import { TBreakpoint } from "@/types/breakpoint";
import { matchBreakpoint } from "@/utils/breakpoints";

export const useBreakpointMatch = (breakpoint: TBreakpoint) => {
  const [matches, setIsMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = matchBreakpoint(breakpoint)
    setIsMatches(mediaQuery.matches);
    
    const handleMediaChange = (event: MediaQueryListEvent) => setIsMatches(event.matches);

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [breakpoint]);

  return matches;
};
