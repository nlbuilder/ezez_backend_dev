import express from "express";

import businessWorkTimesheetController from "../controller/businessWorkTimesheetController";
import { jwtParse } from "../../auth/middleware/auth";

const router = express.Router();

router.get(
    "/business/daily",
    jwtParse,
    businessWorkTimesheetController.getDailyAllWorkTimesheetsForBusiness
);

router.get(
    "/business/weekly",
    jwtParse,
    businessWorkTimesheetController.getWeeklyAllWorkTimesheetForBusiness
);

router.put(
    "/business/daily",
    jwtParse,
    businessWorkTimesheetController.updateDailyStaffWorkTimesheetForBusiness
);

router.delete(
    "/business/daily",
    jwtParse,
    businessWorkTimesheetController.deleteDailyStaffWorkTimesheetForBusiness
);

export default router;
