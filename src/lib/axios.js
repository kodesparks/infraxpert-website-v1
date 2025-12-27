import axios from "axios";
import { getSession } from "@/lib/session";

// Utility function to get token from storage
const getTokenfromStorage = () => {
  const storedToken = JSON.parse(localStorage.getItem("userToken") || "null");
  if (storedToken && storedToken['accessToken']) {
    return storedToken;
  }
  return null;
};

const FetchRequestData = () => {
  /**
   * Custom apiRequest function to make API calls with optional authorization, token refresh, and loading state management.
   * 
   * @param {boolean} setAuthznHeader - Whether to include the Authorization header in the request.
   * @param {string} url - The API endpoint
   * @param {"local-storage" | "cookie"} sessionSource - The source of the session token, either from local storage or cookies.
   * @param {"get" | "post" | "put" | "delete" | "patch"} method - The HTTP method to use for the request.
   * @param {any} data - Optional data to send with the request, applicable for POST, PUT, PATCH requests.
   * @param {Object} headers - Optional custom headers to be added to the request.
   * 
   * @returns {Promise} - Returns a Promise that resolves with the Axios response or rejects with an error.
   */
  const apiRequest = async ({ 
    setAuthznHeader = false, 
    url, 
    sessionSource, 
    method, 
    data, 
    headers = {} 
  }) => {
    return new Promise(async (resolve, reject) => {
      let axiosInstance = axios;

      // Function to execute the API request
      const executeRequest = async (accessToken = null) => {
        const finalHeaders = {
          "Content-Type": "application/json",
          ...headers,
        };
        
        // Set Authorization headers only when param is set and is a valid token
        if (setAuthznHeader && accessToken) {
          finalHeaders["Authorization"] = `Bearer ${accessToken}`;
        }
        
        // Create an Axios instance with custom headers and other configurations
        axiosInstance = axios.create({
          baseURL: url,
          headers: finalHeaders,
          // withCredentials: sessionSource === "cookie", // Enable if needed for production
        });

        // Execute the request
        return axiosInstance({
          method,
          url: url,
          data,
        });
      };

      try {
        let token = null;
        
        // Get the token from the sessionSource
        if (setAuthznHeader) {
          if (sessionSource === "local-storage") {
            token = getTokenfromStorage();
            // Proceed with the request
            const response = await executeRequest(token?.accessToken);
            resolve(response);
          } else if (sessionSource === "cookie") {
            token = getSession();
            const response = await executeRequest(token?.accessToken);
            resolve(response);
          }
        } else {
          // Unauthenticated requests such as login and register etc.
          const response = await executeRequest();
          resolve(response);
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          // Handle unauthorized or forbidden access (refresh token failed)
          console.error("Unauthorized or Forbidden", err);
        }
        reject(err);
      }
    });
  };

  return { apiRequest };
};

export default FetchRequestData;
