import Cookies from "js-cookie";

// Set session (e.g., JWT or session ID)
export const setSession = (tokenData) => {
  const tokenString = typeof tokenData === 'string' ? tokenData : JSON.stringify(tokenData);
  const isProduction = import.meta.env?.MODE === 'production' || import.meta.env?.PROD;
  
  console.log("Setting session cookie:", tokenString);
  console.log("Cookie size:", tokenString.length, "characters");
  console.log("Is production:", isProduction);
  
  // Try setting without encoding first
  Cookies.set('session', tokenString, {
    expires: 7, // Set cookie expiration (in days)
    secure: false, // Set to false for localhost development
    sameSite: 'Lax', // Changed from 'Strict' to 'Lax' for better compatibility
    path: '/',
  });
  
  // Verify cookie was set (with a small delay to ensure it's written)
  setTimeout(() => {
    const verifyCookie = Cookies.get('session');
    console.log("Session cookie verification (delayed):", verifyCookie);
    if (!verifyCookie) {
      console.error("Cookie was not set! Trying alternative approach...");
      // Try with localStorage as fallback
      localStorage.setItem('session', tokenString);
      console.log("Stored in localStorage as fallback");
    }
  }, 100);
};

export const setUserDetails = (data) => {
  const isProduction = import.meta.env?.MODE === 'production' || import.meta.env?.PROD;
  
  console.log("Setting user details cookie:", data);
  
  Cookies.set('userDetails', JSON.stringify(data), {
    expires: 7, // Set cookie expiration (in days)
    secure: false, // Set to false for localhost development
    sameSite: 'Lax', // Changed from 'Strict' to 'Lax' for better compatibility
    path: '/',
  });
  
  // Verify cookie was set (with a small delay to ensure it's written)
  setTimeout(() => {
    const verifyCookie = Cookies.get('userDetails');
    console.log("User details cookie verification (delayed):", verifyCookie);
  }, 100);
};

// Get session
export const getSession = () => {
  const cookie = Cookies.get('session');
  console.log("Getting session cookie:", cookie);
  
  // Check if the cookie is undefined or null, and handle accordingly
  if (!cookie) {
    console.log("No session cookie found, checking localStorage...");
    const localStorageSession = localStorage.getItem('session');
    if (localStorageSession) {
      console.log("Found session in localStorage:", localStorageSession);
      try {
        const sessionData = JSON.parse(localStorageSession);
        console.log("Parsed localStorage session data:", sessionData);
        return sessionData;
      } catch (error) {
        console.error('Error parsing localStorage session:', error);
        return null;
      }
    }
    return null;
  }  

  try {
    const cookieData = JSON.parse(cookie);
    console.log("Parsed session data:", cookieData);
    return cookieData;
  } catch (error) {
    console.error('Error parsing session cookie:', error);
    return null;
  }
};

// Get user details
export const getUserDetails = () => {
  const cookie = Cookies.get('userDetails');
  // Check if the cookie is undefined or null, and handle accordingly
  if (!cookie) {
    return null;
  }

  try {
    const cookieData = JSON.parse(cookie);
    return cookieData;
  } catch (error) {
    console.error('Error parsing user details cookie:', error);
    return null;
  }
};

// Delete session
export const deleteSession = () => {
  Cookies.remove('session', { path: '/' });
  localStorage.removeItem('session');
  console.log("Session cleared from both cookies and localStorage");
};

export const deleteUserDetails = () => {
  Cookies.remove('userDetails', { path: '/' });
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
