import express from "express";

import businessController from "../controller/authBusinessController";
import { jwtParse } from "../middleware/auth";
import { validateBusinessUpdateRequest } from "../middleware/validation";

const router = express.Router();

router.post("/", businessController.createBusinessInfo);
router.get("/", jwtParse, businessController.getBusinessInfo);
router.get(
    "/staffs",
    jwtParse,
    businessController.getBusinessStaffInfoForBusiness
);
router.put(
    "/",
    jwtParse,
    validateBusinessUpdateRequest,
    businessController.updateBusinessInfo
);
router.delete("/", jwtParse, businessController.deleteBusiness);

export default router;
