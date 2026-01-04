import { URLS } from "@/lib/apiUrls";
import { getSession, setSession, getUserDetails, setUserDetails, deleteSession, deleteUserDetails } from '@/lib/session';
import FetchRequestData from '@/lib/axios';
import { decodeJwt, jwtVerify } from 'jose';

/**
 * Refresh the access token using the refresh token
 * @returns {Promise<Object|null>} New token object with access and refresh tokens
 */
export async function refreshToken() {
  const { apiRequest } = FetchRequestData();

  try {
    const token = getSession();
    if (token?.refreshToken) {
      const response = await apiRequest({
        setAuthznHeader: false,
        sessionSource: "cookie",
        url: URLS.refreshToken,
        method: "post",
        data: { refreshToken: token.refreshToken },
      });
      
      const newToken = {
        accessToken: response?.data.accessToken,
        refreshToken: response?.data.refreshToken,
      };
      
      return newToken;
    }
  } catch (error) {
    if (error.code === "ERR_BAD_REQUEST") {
      console.error("Refresh token has expired");
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error: Possible CORS error.");
    } else {
      console.error("Refresh token failed: unhandled exception", error);
    }
  }
  return null;
}

/**
 * Decodes the JWT token without verification
 * @param {string} accessToken - Access token as a string
 * @returns {Object|null} Decoded JWT claims object
 */
export async function decodeToken(accessToken) {
  try {
    const decoded = decodeJwt(accessToken);
    return decoded;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Verify JWT token with signature validation
 * @param {string} token - Access token to validate
 * @returns {Promise<Object>} Verification result with payload and error
 */
export async function verifyClaimsWithSignature(token) {
  try {
    // In production, you would use your actual JWT secret from environment variables
    const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET || 'your-secret-key');
    
    const jwtVerifyOptions = {
      issuer: import.meta.env.VITE_JWT_ISSUER || 'infraxpert',
      algorithms: ['HS256'],
    };

    const { payload } = await jwtVerify(token, secret, jwtVerifyOptions);
    return { payload, error: null };
  } catch (error) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      return { payload: null, error: 'expired' };
    } else {
      return { payload: null, error: 'invalid' };
    }
  }
}

/**
 * Get user details from API
 * @returns {Promise<Object|null>} User object from the API
 */
export async function getUserDetailsFromAPI() {
  const { apiRequest } = FetchRequestData();
  
  try {
    const response = await apiRequest({
      url: URLS.userDetails,
      method: 'get',
      setAuthznHeader: true,
      sessionSource: "cookie",
    });

    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}

/**
 * Login user with email and password
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object|null>} Login response data
 */
export async function loginUser(credentials) {
  const { apiRequest } = FetchRequestData();
  
  try {
    const response = await apiRequest({
      setAuthznHeader: false,
      sessionSource: "cookie",
      url: URLS.login,
      method: "post",
      data: credentials,
    });
    
    if (response?.status === 200 || response?.status === 201) {
      // Store tokens and user data
      if (response.data.accessToken && response.data.refreshToken) {
        const tokenData = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        };
        setSession(tokenData);
      }
      if (response.data.user) {
        setUserDetails(response.data.user);
      }
      return response.data;
    }
  } catch (error) {
    if (error.code === "ERR_BAD_REQUEST") {
      console.error("Login failed:", error.response?.data?.message || "Invalid credentials");
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error: Possible CORS error.");
    }
    console.error("Login failed", error);
    throw error;
  }
  return null;
}

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.phone - User's phone number
 * @param {string} userData.password - User's password
 * @param {string} userData.address - User's address
 * @param {string} userData.pincode - User's pincode
 * @returns {Promise<Object|null>} Registration response data
 */
export async function registerUser(userData) {
  const { apiRequest } = FetchRequestData();
  
  try {
    const response = await apiRequest({
      setAuthznHeader: false,
      sessionSource: "cookie",
      url: URLS.signup,
      method: "post",
      data: userData,
    });
    
    if (response?.status === 200 || response?.status === 201) {
      // Store tokens and user data if registration includes auto-login
      if (response.data.accessToken && response.data.refreshToken) {
        const tokenData = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        };
        setSession(tokenData);
      }
      if (response.data.user) {
        setUserDetails(response.data.user);
      }
      return response.data;
    }
  } catch (error) {
    if (error.code === "ERR_BAD_REQUEST") {
      console.error("Registration failed:", error.response?.data?.message || "Registration failed");
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error: Possible CORS error.");
    }
    console.error("Registration failed", error);
    throw error;
  }
  return null;
}

/**
 * Send forgot password request
 * @param {Object} data - Forgot password data
 * @param {string} data.email - User's email address
 * @returns {Promise<Object|null>} Forgot password response
 */
export async function forgotPassword(data) {
  const { apiRequest } = FetchRequestData();

  try {
    const response = await apiRequest({
      url: URLS.forgotPassword,
      method: "post",
      setAuthznHeader: false,
      sessionSource: "cookie",
      data: data
    });

    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error sending forgot password request:", error);
    throw error;
  }
}

/**
 * Reset password with new password
 * @param {Object} data - Reset password data
 * @param {string} data.password - New password
 * @param {string} data.token - Reset token
 * @returns {Promise<Object|null>} Reset password response
 */
export async function resetPassword(data) {
  const { apiRequest } = FetchRequestData();

  try {
    const response = await apiRequest({
      url: URLS.resetPassword,
      method: "post",
      setAuthznHeader: false,
      sessionSource: "cookie",
      data: data
    });

    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}

/**
 * Change user password
 * @param {Object} data - Change password data
 * @param {string} data.currentPassword - Current password
 * @param {string} data.newPassword - New password
 * @returns {Promise<Object|null>} Change password response
 */
export async function changePassword(data) {
  const { apiRequest } = FetchRequestData();

  try {
    const response = await apiRequest({
      url: URLS.changePassword,
      method: "put",
      setAuthznHeader: true,
      sessionSource: "cookie",
      data: data
    });

    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}

/**
 * Logout user by calling backend logout and clearing session data
 */
export async function logoutUser() {
  const { apiRequest } = FetchRequestData();
  
  try {
    const token = getSession();
    if (token?.refreshToken) {
      await apiRequest({
        setAuthznHeader: false,
        sessionSource: "cookie",
        url: URLS.logout,
        method: "post",
        data: { refreshToken: token.refreshToken },
      });
    }
  } catch (error) {
    console.error("Logout API call failed:", error);
  } finally {
    // Always clear local session data
    deleteSession();
    deleteUserDetails();
    localStorage.removeItem('userToken');
  }
}
