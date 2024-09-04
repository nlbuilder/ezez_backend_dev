import express from "express";

import { jwtParse } from "../../../auth/middleware/auth";
import appointmentAnalyticsController from "../controller/appointmentAnalyticsController";

const router = express.Router();

router.get(
    "/hourly",
    jwtParse,
    appointmentAnalyticsController.getAppointmentAnalyticsHourly
);

router.get(
    "/weekday",
    // jwtParse,
    appointmentAnalyticsController.getAppointmentAnalyticsWeekday
);

// export the router
export default router;
