import express from "express";

import staffWorkTimesheetController from "../controller/staffWorkTimesheetController";
import { jwtParse } from "../../auth/middleware/auth";

const router = express.Router();

router.post(
    "/staff/daily",
    jwtParse,
    staffWorkTimesheetController.createDailyStaffWorkTimesheet
);

router.get(
    "/staff/daily",
    jwtParse,
    staffWorkTimesheetController.getDailyStaffWorkTimesheet
);

router.get(
    "/staff/weekly",
    jwtParse,
    staffWorkTimesheetController.getWeeklyStaffWorkTimesheetForStaff
);

router.put(
    "/staff/daily",
    jwtParse,
    staffWorkTimesheetController.updateDailyStaffWorkTimesheet
);

router.delete(
    "/staff/daily",
    jwtParse,
    staffWorkTimesheetController.deleteDailyStaffWorkTimesheet
);

export default router;
