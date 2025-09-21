import Cookies from "js-cookie";

// Set session (e.g., JWT or session ID)
export const setSession = (tokenData) => {
  const isProduction = import.meta.env?.MODE === 'production' || import.meta.env?.PROD;
  
  // Only store essential token data to avoid cookie size limits
  const essentialTokenData = {
    accessToken: tokenData.accessToken,
    refreshToken: tokenData.refreshToken
  };
  
  const tokenString = JSON.stringify(essentialTokenData);
  
  console.log("Setting session (essential data only)");
  console.log("Token size:", tokenString.length, "characters");
  console.log("Is production:", isProduction);
  
  // Check if token data is too large (10MB localStorage limit)
  if (tokenString.length > 10 * 1024 * 1024) {
    console.error("Token data too large for any browser storage!");
    console.error("Token size:", tokenString.length, "characters");
    console.error("This indicates a backend issue with JWT generation");
    throw new Error("Token too large - backend JWT generation issue");
  }
  
  // Check if token data is too large for cookies (4KB limit)
  if (tokenString.length > 4000) {
    console.warn("Token data too large for cookies, using localStorage only");
    try {
      localStorage.setItem('session', tokenString);
      console.log("Stored in localStorage successfully");
    } catch (error) {
      console.error("Failed to store in localStorage:", error);
      throw new Error("Token too large for browser storage");
    }
    return;
  }
  
  try {
    // Try setting cookie first
    Cookies.set('session', tokenString, {
      expires: 7, // Set cookie expiration (in days)
      secure: false, // Set to false for localhost development
      sameSite: 'Lax', // Changed from 'Strict' to 'Lax' for better compatibility
      path: '/',
    });
    
    // Also store in localStorage as backup
    localStorage.setItem('session', tokenString);
    
    // Verify cookie was set (with a small delay to ensure it's written)
    setTimeout(() => {
      const verifyCookie = Cookies.get('session');
      console.log("Session cookie verification (delayed):", verifyCookie ? "Set successfully" : "Not set");
    }, 100);
  } catch (error) {
    console.error("Failed to set session cookie:", error);
    // Fallback to localStorage only
    try {
      localStorage.setItem('session', tokenString);
      console.log("Stored in localStorage as fallback");
    } catch (localStorageError) {
      console.error("Failed to store in localStorage:", localStorageError);
      throw new Error("Token too large for browser storage");
    }
  }
};

export const setUserDetails = (data) => {
  console.log("Setting user details in localStorage:", data);
  
  try {
    // Store user details in localStorage instead of cookies
    localStorage.setItem('userDetails', JSON.stringify(data));
    console.log("User details stored in localStorage successfully");
  } catch (error) {
    console.error("Failed to store user details in localStorage:", error);
  }
};

// Get session
export const getSession = () => {
  // Try localStorage first (more reliable for large data)
  const localStorageSession = localStorage.getItem('session');
  if (localStorageSession) {
    try {
      const sessionData = JSON.parse(localStorageSession);
      console.log("Found session in localStorage");
      return sessionData;
    } catch (error) {
      console.error('Error parsing localStorage session:', error);
    }
  }
  
  // Fallback to cookie
  const cookie = Cookies.get('session');
  if (cookie) {
    try {
      const cookieData = JSON.parse(cookie);
      console.log("Found session in cookie");
      return cookieData;
    } catch (error) {
      console.error('Error parsing session cookie:', error);
    }
  }
  
  console.log("No session found in localStorage or cookies");
  return null;
};

// Get user details
export const getUserDetails = () => {
  try {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      const parsedData = JSON.parse(userDetails);
      console.log("Found user details in localStorage");
      return parsedData;
    }
  } catch (error) {
    console.error('Error parsing user details from localStorage:', error);
  }
  
  console.log("No user details found in localStorage");
  return null;
};

// Delete session
export const deleteSession = () => {
  Cookies.remove('session', { path: '/' });
  localStorage.removeItem('session');
  console.log("Session cleared from both cookies and localStorage");
};

export const deleteUserDetails = () => {
  localStorage.removeItem('userDetails');
  console.log("User details removed from localStorage");
};

// Page section management for preserving tab/section information
const PAGE_INFO_COOKIE_NAME = import.meta.env.VITE_COOKIE_TAB_MANAGER || 'pageInfo';

// Retrieve the active tab for a specific page URI
export function getSectionFromCookie(uriPath) {
  try {
    const cookieValue = Cookies.get(PAGE_INFO_COOKIE_NAME);
    if (cookieValue) {
      const tabData = JSON.parse(cookieValue);
      return tabData[uriPath] || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to parse tab cookie:', error);
    return null;
  }
}

// Set the active tab for a specific page URI
export function setSectionInCookie(uriPath, section) {
  try {
    const cookieValue = Cookies.get(PAGE_INFO_COOKIE_NAME);
    const tabData = cookieValue ? JSON.parse(cookieValue) : {};
    tabData[uriPath] = section;
    const isProduction = import.meta.env?.MODE === 'production' || import.meta.env?.PROD;
    
    Cookies.set(PAGE_INFO_COOKIE_NAME, JSON.stringify(tabData), { 
      expires: 7,
      secure: false, // Set to false for localhost development
      sameSite: 'Lax', // Changed from 'Strict' to 'Lax' for better compatibility
      path: '/'
     }); // Set cookie with 7-day expiration
  } catch (error) {
    console.error('Failed to set tab in cookie:', error);
  }
}
