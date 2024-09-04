import express from "express";

import { jwtParse } from "../../../auth/middleware/auth";
import staffWorkTimesheetAnalyticsController from "../controller/staffWorkTimesheetAnalyticsController";

const router = express.Router();

router.get(
    "/",
    jwtParse,
    staffWorkTimesheetAnalyticsController.getStaffWorkTimeSheetAnalytics
);

// export the router
export default router;
