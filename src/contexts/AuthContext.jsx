import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  deleteSession, 
  getSession, 
  getUserDetails, 
  setSession 
} from "@/lib/session";
import { 
  refreshToken, 
  decodeToken, 
  loginUser, 
  registerUser, 
  logoutUser, 
  forgotPassword as forgotPasswordService
} from "@/services/auth";
import FetchRequestData from "@/lib/axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [preLoader, setPreLoader] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reload, setReload] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [claims, setClaims] = useState(null);

  const { apiRequest } = FetchRequestData();

  // Get redirect URL based on current path
  const getRedirectUrl = (pathname) => {
    if (pathname.startsWith("/admin")) {
      return "/admin/login?redirectUrl=" + pathname;
    } else if (pathname.startsWith("/dashboard")) {
      return "/dashboard/login?redirectUrl=" + pathname;
    } else {
      return "/login?redirectUrl=" + pathname;
    }
  };

  useEffect(() => {
    const checkTokenExpiry = async () => {
      const token = getSession();

      if (token?.accessToken && token?.refreshToken) {
        setIsAuthenticated(true);

        try {
          const userData = getUserDetails();
          if (userData) {
            setUser(userData);
            
            // Assign Role Correctly based on backend response
            if (userData?.role === "admin") {
              setRole("admin");
            } else if (userData?.role === "manager") {
              setRole("manager");
            } else if (userData?.role === "employee") {
              setRole("employee");
            } else if (userData?.role === "vendor") {
              setRole("vendor");
            } else {
              setRole("customer"); // Default role from backend
            }
          }

          const decodedClaims = await decodeToken(token.accessToken);
          if (decodedClaims) {
            setClaims(decodedClaims);

            const exp = decodedClaims?.exp;
            const currentTime = Math.floor(Date.now() / 1000);

            // Ensure `exp` is defined before using it
            if (typeof exp !== "number") {
              console.error("Token expiry (`exp`) is missing or invalid.");
              return;
            }

            const expiryTime = exp * 1000; // Convert to milliseconds
            const timeLeft = (expiryTime - Date.now()) / 1000; // Convert to seconds

            // Refresh token if it expires in less than 5 minutes
            if (timeLeft <= 5 * 60) {
              const newToken = await refreshToken();
              if (newToken) {
                setSession(newToken);
                const updatedUser = getUserDetails();
                setUser(updatedUser);
                setRole(updatedUser?.role || "customer");
              } else {
                deleteSession();
                navigate(getRedirectUrl(location.pathname));
              }
            }
          }
        } catch (error) {
          console.error("Error checking token expiry:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setPreLoader(false);
    };

    checkTokenExpiry();
    
    // Check expiry every 5 minutes
    const intervalId = setInterval(checkTokenExpiry, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Authentication state changed to true");
    } else {
      console.log("Authentication state changed to false");
    }
  }, [isAuthenticated]);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      
      if (response) {
        setIsAuthenticated(true);
        setUser(response.user);
        setRole(response.user?.role || "customer");
        
        // Redirect to intended page or home
        const redirectUrl = new URLSearchParams(location.search).get('redirectUrl');
        navigate(redirectUrl || '/');
        
        return response;
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      
      if (response) {
        setIsAuthenticated(true);
        setUser(response.user);
        setRole(response.user?.role || "customer");
        
        // Redirect to intended page or home
        const redirectUrl = new URLSearchParams(location.search).get('redirectUrl');
        navigate(redirectUrl || '/');
        
        return response;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    setUser(null);
    setRole("");
    setClaims(null);
    navigate('/');
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      return await forgotPasswordService({ email });
    } catch (error) {
      console.error("Forgot password failed:", error);
      throw error;
    }
  };

  const value = {
    preLoader,
    setPreLoader,
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    claims,
    role,
    setRole,
    reload,
    setReload,
    apiRequest,
    login,
    register,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
