import express from "express";
import {
  getallusers,
  Login,
  Signup,
  updateprofile,
  forgotPassword,
  verifyOTP,
  getLoginHistory,
  requestLanguageSwitch,
  verifyLanguageSwitch,
  updatePhoneNumber,
  verifyPhoneNumber,
  uploadAvatar,
  getNotifications,
  markNotificationRead,
  setNotificationsEnabled,
  googleAuth,
  githubAuth,
} from "../controller/auth.js";

const router = express.Router();
import auth from "../middleware/auth.js";
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, unique);
  },
});
const upload = multer({ storage });

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/google", googleAuth);
router.post("/github", githubAuth);
router.post("/verify-otp", verifyOTP);
router.get("/history", auth, getLoginHistory);
router.post("/request-language-switch", auth, requestLanguageSwitch);
router.post("/verify-language-switch", auth, verifyLanguageSwitch);
router.post("/update-phone", auth, updatePhoneNumber);
router.post("/verify-phone", auth, verifyPhoneNumber);

router.post("/forgot-password", forgotPassword);
router.get("/getalluser", getallusers);
router.patch("/update/:id", auth, updateprofile);
// Avatar upload
router.post("/upload-avatar/:id", auth, upload.single("avatar"), uploadAvatar);
// Notifications
router.get("/notifications", auth, getNotifications);
router.patch("/notifications/mark-read/:id", auth, markNotificationRead);
router.post("/notifications/enabled", auth, setNotificationsEnabled);
export default router;
