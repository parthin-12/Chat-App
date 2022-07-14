import express from "express";
import { adminDeleteUser, adminGetUser, adminUpdateProfile, ForgetPasswordUser, getAllUsers, getUser, loginUser, logoutUser, registerUser, resetPassword, updatePassword, updateProfile } from "../controllers/userController.js";
import { isUserHaveAuth, userRole } from "../middleware/auth.js";
const router =express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/admin/users").get(isUserHaveAuth,userRole("admin","master"),getAllUsers);
router.route("/admin/user/:id").get(isUserHaveAuth,userRole("admin","master"),adminGetUser)
.put(isUserHaveAuth,userRole("admin","master"),adminUpdateProfile)
.delete(isUserHaveAuth,userRole("admin","master"),adminDeleteUser);

router.route("/user").get(isUserHaveAuth,getUser);
router.route("/user/update/password").put(isUserHaveAuth,updatePassword);
router.route("/user/update").put(isUserHaveAuth,updateProfile);

router.route("/password/forget/").post(ForgetPasswordUser);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);

export default router;