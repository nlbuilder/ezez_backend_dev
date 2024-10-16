import express from "express";

import businessStaffController from "../controller/authBusinessStaffController";
import { jwtParse } from "../middleware/auth";
import { validateBusinessStaffUpdateRequest } from "../middleware/validation";

const router = express.Router();

// router.post("/", businessStaffController.createBusinessStaff);
router.get("/", jwtParse, businessStaffController.getBusinessStaffInfo);
router.put(
    "/",
    jwtParse,
    // validateBusinessStaffUpdateRequest,
    businessStaffController.updateBusinessStaffInfo
);
// router.delete("/", jwtParse, businessStaffController.deleteBusinessStaff);

export default router;
