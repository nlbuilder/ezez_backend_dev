import express from "express";

import businessController from "../controller/authBusinessController";
import { jwtParse } from "../middleware/auth";
import { validateBusinessUpdateRequest } from "../middleware/validation";

const router = express.Router();

router.post("/", businessController.createBusinessInfo);
router.get("/", businessController.getBusinessInfo);
router.put(
    "/",
    jwtParse,
    // validateBusinessUpdateRequest,
    businessController.updateBusinessInfo
);
router.delete("/", jwtParse, businessController.deleteBusiness);

export default router;
