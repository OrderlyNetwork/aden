import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigation } from "@remix-run/react";

// Create a context for the loading state
type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Provider component
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  
  useEffect(() => {
    if (navigation.state === "loading") {
      setIsLoading(true);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);
  
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && <LoadingOverlay />}
    </LoadingContext.Provider>
  );
}

// Hook to use the loading context
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

// The actual overlay component
function LoadingOverlay() {
  return (
    <div className="dc-fixed dc-inset-0 dc-z-50 dc-flex dc-items-center dc-justify-center dc-bg-black">
      <div className="dc-flex dc-flex-col dc-items-center dc-p-6 dc-bg-black dc-rounded-sm dc-shadow-xl">
        <div className="dc-animate-spin dc-w-16 dc-h-16 dc-mb-4 dc-border-t-4 dc-border-b-4 dc-border-blue-500 dc-rounded-sm"></div>
        <p className="dc-text-lg dc-font-semibold dc-text-white">Loading...</p>
      </div>
    </div>
  );
}

// Default export for backward compatibility
export default LoadingOverlay; 