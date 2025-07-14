export const breakpoints = {
    mobile: 640,
    tablet: 768,
    laptop: 1024,
    desktop: 1280,
};
  
export const devices = {
    mobile: `(max-width: ${breakpoints.mobile}px)`,
    tablet: `(min-width: ${breakpoints.mobile + 1}px) and (max-width: ${breakpoints.tablet}px)`,
    laptop: `(min-width: ${breakpoints.tablet + 1}px) and (max-width: ${breakpoints.laptop}px)`,
    desktop: `(min-width: ${breakpoints.laptop + 1}px)`,
};