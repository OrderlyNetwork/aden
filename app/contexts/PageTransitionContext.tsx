import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useNavigation } from '@remix-run/react';

type PageTransitionContextType = {
  isPreviousPageVisible: boolean;
  isNewPageLoading: boolean;
  navigateTo: (path: string) => void;
  currentKey: string;
  previousKey: string | null;
  previousPath: string | null;
};

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();

  // location이 undefined인 경우 방어 처리
  if (!location) {
    console.warn('Location is not available in PageTransitionProvider');
    return <>{children}</>;
  }

  const [isPreviousPageVisible, setIsPreviousPageVisible] = useState(false);
  const [isNewPageLoading, setIsNewPageLoading] = useState(false);
  const [currentKey, setCurrentKey] = useState(location.key);
  const [previousKey, setPreviousKey] = useState<string | null>(null);
  const [previousPath, setPreviousPath] = useState<string | null>(null);


  // Track Remix's navigation state to synchronize with our own state
  useEffect(() => {
    // console.log('Navigation state:', navigation.state); // Debugging
    if (navigation.state === 'loading') {
      setIsNewPageLoading(true);
      // Optional: You might want to ensure previous page is visible immediately on loading state change
      // setIsPreviousPageVisible(true);
    } else if (navigation.state === 'idle' && isNewPageLoading) {
      // When Remix finishes loading data, start transitioning out the old page
      // console.log('Navigation idle, new page loaded'); // Debugging
       const timer = setTimeout(() => {
         setIsNewPageLoading(false);

         // After a short delay for transition animation, hide the previous page
         // This delay should match your CSS transition duration for the "exit" animation
         const hideTimer = setTimeout(() => {
           setIsPreviousPageVisible(false);
          //  console.log('Previous page hidden'); // Debugging
         }, 400); // <<< Make sure this matches your CSS transition duration

         return () => clearTimeout(hideTimer);
       }, 100); // small delay to ensure data is properly rendered before starting exit transition

       return () => clearTimeout(timer);
     }
  }, [navigation.state, isNewPageLoading]);

  // When location changes, update the current and previous keys and show previous page
  useEffect(() => {
    // location이나 필요한 속성들이 존재하는지 확인
    if (!location || !location.key) {
      return;
    }

    // console.log('Location changed:', location.pathname, 'Key:', location.key); // Debugging
    if (location.key !== currentKey) {
      setPreviousKey(currentKey);
      // Note: location.pathname here is the NEW path, not the previous one.
      // If you need the previous path, you might need to store it separately
      // before updating currentKey.
      setPreviousPath(location.pathname || ''); // This will store the path *just navigated TO* as the previous path on the *next* navigation
      setCurrentKey(location.key);

      // When location changes (meaning a new page is about to be shown),
      // make sure the previous page container is visible for the transition.
      setIsPreviousPageVisible(true);
      // console.log('Previous page set visible'); // Debugging
    }
  }, [location, currentKey]);

  // Custom navigation function to handle transitions
  const navigateTo = useCallback((path: string) => {
    // 방어적 프로그래밍: path가 유효한지 확인
    if (!path || typeof path !== 'string') {
      console.warn('Invalid path provided to navigateTo:', path);
      return;
    }

    // navigate 함수가 존재하는지 확인
    if (!navigate) {
      console.warn('Navigate function is not available');
      return;
    }

    try {
      if (path === location?.pathname) {
        // Optional: If navigating to the same path, force a state update
        // or use replaceState if you don't want a new history entry.
        // Forcing re-render via key should handle re-animating even same path visits
        // if the navigation library pushes a new state.
        //  console.log('Navigating to same path, forcing state visible to potentially re-trigger transition layer');
         setIsPreviousPageVisible(true); // Ensure state is true if needed by transition logic
         navigate(path); // navigate will likely push a new state with a new key anyway
         return;
      }

      // console.log('Navigating to:', path); // Debugging
      setIsPreviousPageVisible(true); // Ensure previous page is visible for transition out
      navigate(path);
    } catch (error) {
      console.error('Error during navigation:', error);
    }
  }, [navigate, location?.pathname]);


  // *** MODIFIED RETURN PART ***
  return (
    <PageTransitionContext.Provider
      value={{
        isPreviousPageVisible,
        isNewPageLoading,
        navigateTo,
        currentKey,
        previousKey,
        previousPath
      }}
    >
      {/* Wrap the children (the page content) with a div that uses location.key as its key.
        This forces React to re-mount the page component tree every time location.key changes,
        which happens on every navigation, ensuring animations tied to mount/initial render
        or state changes triggered by navigation get a fresh start.
        
        You will need to handle the actual visual layering and animation 
        in the component that CONSUMES this provider (e.g., in your root route or layout), 
        using isPreviousPageVisible and potentially previousKey/previousPath
        to render the old page content alongside the new content keyed by location.key.
      */}
      <div key={location?.key || 'default'} style={{ width: '100%', height: '100%', position: 'relative' /* Add styling necessary for your transition layout */ }}>
        {children}
      </div>
    </PageTransitionContext.Provider>
  );
};

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (context === undefined) {
    // 개발 환경에서는 에러를 throw하지만, 프로덕션에서는 기본값 반환
    if (process.env.NODE_ENV === 'development') {
      throw new Error('usePageTransition must be used within a PageTransitionProvider');
    }
    
    // 기본값 반환으로 앱이 크래시되지 않도록 방지
    console.warn('usePageTransition hook called outside of PageTransitionProvider, returning default values');
    return {
      isPreviousPageVisible: false,
      isNewPageLoading: false,
      navigateTo: (path: string) => {
        console.warn('navigateTo called but no provider available, path:', path);
      },
      currentKey: 'default',
      previousKey: null,
      previousPath: null,
    };
  }
  return context;
};