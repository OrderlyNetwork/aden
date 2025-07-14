import { useEffect } from 'react';
import { useNavigation } from '@remix-run/react';
import { usePageTransition } from '../contexts/PageTransitionContext';

/**
 * Hook that connects Remix's data loading system with our page transition system
 * It watches Remix's navigation state and updates our transition context accordingly
 */
export function useTransitionLoader() {
  const navigation = useNavigation();
  const { isPreviousPageVisible, isNewPageLoading } = usePageTransition();
  
  useEffect(() => {
    // This effect will run whenever the navigation state changes
    // It will update the loading state of our page transition system
    
    // We can use this hook in a layout component that wraps the Outlet
    // to ensure that data loading is properly synchronized with our transitions
    
    // In a more complex implementation, we would update the loading state
    // based on the navigation state and possibly emit events for transition completion
    
    // console.log('Navigation state:', navigation.state);
    // console.log('Page transition state:', { isPreviousPageVisible, isNewPageLoading });
    
    // Here we could add code to:
    // 1. Update global loading indicators
    // 2. Trigger animations based on loading progress
    // 3. Update page transition states based on Remix's navigation state
  }, [navigation.state, isPreviousPageVisible, isNewPageLoading]);
  
  return {
    isLoading: navigation.state !== 'idle',
    navigation,
  };
}

export default useTransitionLoader;