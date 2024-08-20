import express from "express";

import appointmentController from "../controller/appointmentController";
import { jwtParse } from "../../auth/middleware/auth";

const router = express.Router();

router.post("/", jwtParse, appointmentController.createAppointment);
router.get("/", jwtParse, appointmentController.getAppointmentInfo);
router.put("/", jwtParse, appointmentController.updateAppointmentInfo);
router.delete("/", jwtParse, appointmentController.deleteAppointment);

export default router;
