import { useState, createContext, useContext } from "react";
import axiosInstance from "./axiosinstance";
import { toast } from "react-toastify";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);

  const Signup = async ({ name, email, password }) => {
    setloading(true);
    seterror(null);
    try {
      const res = await axiosInstance.post("/user/signup", {
        name,
        email,
        password,
      });
      const { data, token } = res.data;
      localStorage.setItem("user", JSON.stringify({ ...data, token }));
      setUser(data);
      toast.success("Signup Successful");
    } catch (error) {
      const msg = error.response?.data.message || "Signup failed";
      seterror(msg);
      toast.error(msg);
    } finally {
      setloading(false);
    }
  };
  const Login = async ({ email, password }) => {
    setloading(true);
    seterror(null);
    try {
      const res = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      // Check for OTP requirement
      if (res.data.needsOTP) {
        setloading(false);
        return res.data; // Return data to let UI handle OTP
      }

      const { data, token } = res.data;
      localStorage.setItem("user", JSON.stringify({ ...data, token }));
      setUser(data);
      toast.success("Login Successful");
      return res.data;
    } catch (error) {
      setloading(false);
      const msg = error.response?.data.message || "Login failed";
      seterror(msg);
      toast.error(msg);
      throw error;
    }
  };

  const VerifyOTP = async ({ userId, otp }) => {
    setloading(true);
    seterror(null);
    try {
      const res = await axiosInstance.post("/user/verify-otp", {
        userId,
        otp
      });
      const { data, token } = res.data;
      localStorage.setItem("user", JSON.stringify({ ...data, token }));
      setUser(data);
      toast.success("Login Successful");
      return res.data;
    } catch (error) {
      setloading(false);
      const msg = error.response?.data.message || "OTP Verification failed";
      seterror(msg);
      toast.error(msg);
      throw error;
    }
  }

  const Logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out");
  };
  return (
    <AuthContext.Provider
      value={{ user, Signup, Login, VerifyOTP, Logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
