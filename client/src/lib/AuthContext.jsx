import { useState, createContext, useContext, useEffect } from "react";
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
  const [shownNotifications, setShownNotifications] = useState(new Set());
  const [notifications, setNotifications] = useState([]);

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
      if (res.data.otpRequired) {
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

  const SocialLogin = async (type, payload) => {
    setloading(true);
    seterror(null);
    try {
      const endpoint = type === "google" ? "/user/google" : "/user/github";
      const res = await axiosInstance.post(endpoint, payload);
      const { result, token } = res.data;
      localStorage.setItem("user", JSON.stringify({ ...result, token }));
      setUser(result);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} Login Successful`);
      return res.data;
    } catch (error) {
      setloading(false);
      const msg = error.response?.data.message || `${type} login failed`;
      seterror(msg);
      toast.error(msg);
      throw error;
    } finally {
      setloading(false);
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
  const updateUser = (newData) => {
    const merged = { ...(user || {}), ...newData };
    setUser(merged);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      const base = stored ? JSON.parse(stored) : {};
      const combined = { ...base, ...merged };
      localStorage.setItem("user", JSON.stringify(combined));
    }
  };

  // Poll for notifications and show browser Notification API popups
  useEffect(() => {
    let polling = null;
    const fetchAndNotify = async () => {
      if (!user || !user.notificationsEnabled) return;
      try {
        const res = await axiosInstance.get("/user/notifications");
        const notifs = res.data.data || [];
        setNotifications(notifs);
        for (const n of notifs) {
          if (!n.read && !shownNotifications.has(n._id)) {
            // Request permission if needed
            if (typeof Notification !== "undefined") {
              if (Notification.permission === "default") {
                await Notification.requestPermission();
              }
              if (Notification.permission === "granted") {
                const popup = new Notification("CodeQuest", {
                  body: n.message,
                });
                popup.onclick = () => {
                  window.location.href = n.link || "/";
                };
              }
            }
            // mark as shown locally only (server read state stays until user opens in-app)
            setShownNotifications((prev) => new Set(prev).add(n._id));
          }
        }
      } catch (error) {
        // ignore polling errors
      }
    };
    if (user && user.notificationsEnabled) {
      fetchAndNotify();
      polling = setInterval(fetchAndNotify, 15000);
    }
    return () => {
      if (polling) clearInterval(polling);
    };
  }, [user, shownNotifications]);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/user/notifications");
      setNotifications(res.data.data || []);
      return res.data.data || [];
    } catch (err) {
      return [];
    }
  };

  const markNotificationRead = async (id) => {
    try {
      const res = await axiosInstance.patch(`/user/notifications/mark-read/${id}`);
      // update local state
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      return res.data.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, Signup, Login, SocialLogin, VerifyOTP, Logout, updateUser, loading, error, notifications, fetchNotifications, markNotificationRead }}
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
