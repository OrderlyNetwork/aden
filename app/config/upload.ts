// Upload server configuration
// This can be changed dynamically based on environment

export const getUploadServerUrl = (): string => {
  // 1. Check if running in browser and use current host
  if (typeof window !== 'undefined') {
    // Use environment variable if set
    if (window.ENV?.UPLOAD_SERVER_URL) {
      return window.ENV.UPLOAD_SERVER_URL;
    }
    
    // Otherwise use current host for relative URLs
    // This makes the app work regardless of where it's deployed
    return window.location.origin;
  }
  
  // 2. Server-side: use environment variable or default
  return process.env.UPLOAD_SERVER_URL || 'http://localhost:8081';
};

// Get the base path for file APIs
export const getFileApiBasePath = (): string => {
  const serverUrl = getUploadServerUrl();
  // If we're using the same origin, don't add any prefix
  if (typeof window !== 'undefined' && serverUrl === window.location.origin) {
    return '';
  }
  return serverUrl;
};