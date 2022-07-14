import express from "express";
import { ForgetPasswordUser, getUser, loginUser, logoutUser, registerUser, resetPassword, updatePassword, updateProfile} from "../Controllers/userController.js";
import { isUserHaveAuth } from "../middleware/auth.js";

const router=express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

router.route("/user").get(isUserHaveAuth,getUser);

router.route("/password/forget/").post(ForgetPasswordUser);
router.route("/password/reset/:token").put(resetPassword);

router.route("/user/update/password").put(isUserHaveAuth,updatePassword);
router.route("/user/update").put(isUserHaveAuth,updateProfile);


export default router;