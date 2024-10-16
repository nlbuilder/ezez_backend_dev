import express from "express";

import businessControllerForBusiness from "../controller/authBusinessStaffControllerForBusiness";
import { jwtParse } from "../middleware/auth";
import { validateBusinessUpdateRequest } from "../middleware/validation";

const router = express.Router();

router.post(
    "/",
    jwtParse,
    // validateBusinessUpdateRequest,
    businessControllerForBusiness.createBusinessStaff
);

router.get(
    "/",
    jwtParse,
    businessControllerForBusiness.getBusinessStaffInfoForBusiness
);

router.delete("/", jwtParse, businessControllerForBusiness.deleteBusinessStaff);

export default router;
