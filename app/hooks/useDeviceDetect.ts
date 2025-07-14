import { useMediaQuery } from '~/hooks/useMediaQuery';
import { QUERIES } from '~/constants/breakpoints';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDeviceDetect(): DeviceType {
  const isMobile = useMediaQuery(QUERIES.mobileAndBelow);
  const isTablet = useMediaQuery(QUERIES.tabletAndBelow) && !isMobile;
  const isDesktop = !isMobile && !isTablet;

  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
} 