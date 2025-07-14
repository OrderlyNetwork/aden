import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigation } from '@remix-run/react';

type LoadingScreenProps = {
  children: ReactNode;
  minimumLoadingTime?: number; // Minimum time to show loading screen in ms
  showLoadingIndicator?: boolean; // Whether to show loading spinner
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  children, 
  minimumLoadingTime = 500,
  showLoadingIndicator = true
}) => {
  const navigation = useNavigation();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isDomReady, setIsDomReady] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState(0);
  const [previousContent, setPreviousContent] = useState<ReactNode | null>(null);
  const [currentContent, setCurrentContent] = useState<ReactNode | null>(null);

  // Handle navigation state changes
  useEffect(() => {
    if (navigation.state === 'loading') {
      // Save the previous content when navigation starts
      if (currentContent) {
        setPreviousContent(currentContent);
      }
      setIsDataLoaded(false);
      setIsDomReady(false);
      setLoadingStartTime(Date.now());
    } else if (navigation.state === 'idle') {
      // When navigation is complete, mark data as loaded
      setIsDataLoaded(true);
    }
  }, [navigation.state, currentContent]);

  // Update current content when children change
  useEffect(() => {
    setCurrentContent(children);
  }, [children]);

  // Handle DOM readiness
  useEffect(() => {
    // Check if DOM is ready
    if (isDataLoaded) {
      const remainingTime = Math.max(0, minimumLoadingTime - (Date.now() - loadingStartTime));
      
      // Ensure minimum loading time is respected
      const timer = setTimeout(() => {
        setIsDomReady(true);
        // Clear previous content after transition
        setTimeout(() => {
          setPreviousContent(null);
        }, 300); // transition duration
      }, remainingTime);
      
      return () => clearTimeout(timer);
    }
  }, [isDataLoaded, loadingStartTime, minimumLoadingTime]);

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="dc-fixed dc-top-0 dc-right-0 dc-z-50 dc-m-4">
      <div className="dc-bg-opacity-70 dc-flex dc-items-center dc-px-4 dc-py-2 dc-space-x-2 dc-text-white dc-bg-black dc-rounded-sm">
        <div className="dc-animate-spin dc-border-t-transparent dc-w-5 dc-h-5 dc-border-2 dc-border-white dc-rounded-sm"></div>
        <span>Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="loading-screen-transition dc-relative dc-w-full dc-h-full">
      {/* Show previous content while loading */}
      {!isDomReady && previousContent && (
        <div className="loading-screen-prev">
          {previousContent}
          {/* Show loading indicator on top of previous content */}
          {!isDataLoaded && showLoadingIndicator && <LoadingIndicator />}
        </div>
      )}
      
      {/* Current content (hidden while loading, shown after) */}
      <div 
        className={`loading-screen-current ${isDomReady ? 'dc-visible' : 'dc-hidden'}`}
      >
        {currentContent}
      </div>
    </div>
  );
};

export default LoadingScreen; 