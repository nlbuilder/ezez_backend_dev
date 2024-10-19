import express from "express";

import businessHourController from "../controller/businessHourController";
import { jwtParse } from "../../auth/middleware/auth";

const router = express.Router();

router.post("/", jwtParse, businessHourController.createBusinessHour);
router.get("/", jwtParse, businessHourController.getBusinessHourInfo);
router.put("/", jwtParse, businessHourController.updateBusinessHourInfo);

export default router;
