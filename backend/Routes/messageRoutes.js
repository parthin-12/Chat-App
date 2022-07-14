import express from "express";
import { acceptRejectRequestController, createGroup, getAllGroups, getAllMessages, groupRolesHandler, memberRoleHandler, sendMessage, updateGroup } from "../Controllers/messageController.js";
import { isUserHaveAuth } from "../middleware/auth.js";

const router=express.Router();

router.route("/group").post(isUserHaveAuth,createGroup);
router.route("/groups").get(isUserHaveAuth,getAllGroups);
router.route("/message").post(isUserHaveAuth,sendMessage);
router.route("/messages/:id").get(isUserHaveAuth,getAllMessages);
router.route("/grouprole").put(isUserHaveAuth,groupRolesHandler);
router.route("/acceptreject").put(isUserHaveAuth,acceptRejectRequestController);
router.route("/memberrole").put(isUserHaveAuth,memberRoleHandler);
router.route("/group/:groupId").put(isUserHaveAuth,updateGroup);


export default router;
