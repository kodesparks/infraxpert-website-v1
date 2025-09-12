import Cookies from "js-cookie";

// Set session (e.g., JWT or session ID)
export const setSession = (tokenData) => {
  const tokenString = typeof tokenData === 'string' ? tokenData : JSON.stringify(tokenData);
  const isProduction = import.meta.env?.MODE === 'production' || import.meta.env?.PROD;
  
  Cookies.set('session', tokenString, {
    expires: 7, // Set cookie expiration (in days)
    secure: isProduction, // Only secure in production
    sameSite: 'Strict',
    path: '/',
  });
};

export const setUserDetails = (data) => {
  const isProduction = import.meta.env?.MODE === 'production' || import.meta.env?.PROD;
  
  Cookies.set('userDetails', JSON.stringify(data), {
    expires: 7, // Set cookie expiration (in days)
    secure: isProduction, // Only secure in production
    sameSite: 'Strict',
    path: '/',
  });
};

// Get session
export const getSession = () => {
  const cookie = Cookies.get('session');
  // Check if the cookie is undefined or null, and handle accordingly
  if (!cookie) {
    return null;
  }  

  try {
    const cookieData = JSON.parse(decodeURIComponent(cookie));
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
      secure: isProduction, // Only secure in production
      sameSite: 'Strict',
      path: '/'
     }); // Set cookie with 7-day expiration
  } catch (error) {
    console.error('Failed to set tab in cookie:', error);
  }
}
