export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

export const QUERIES = {
  mobileAndBelow: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tabletAndBelow: `(max-width: ${BREAKPOINTS.tablet}px)`,
  desktopAndBelow: `(max-width: ${BREAKPOINTS.desktop}px)`,
  tabletAndAbove: `(min-width: ${BREAKPOINTS.mobile + 1}px)`,
  desktopAndAbove: `(min-width: ${BREAKPOINTS.tablet + 1}px)`,
}; 