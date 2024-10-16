import express from "express";

import serviceController from "../controller/serviceController";
import { jwtParse } from "../../auth/middleware/auth";

const router = express.Router();

router.post("/", jwtParse, serviceController.createService);
router.get("/", jwtParse, serviceController.getServiceInfo);
router.get("/services", jwtParse, serviceController.getAllServicesInfo);
router.put("/", jwtParse, serviceController.updateServiceInfo);
router.delete("/", jwtParse, serviceController.deleteService);

export default router;
