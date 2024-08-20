import express from "express";

import loyaltyController from "../controller/loyaltyController";
import { jwtParse } from "../../auth/middleware/auth";

const router = express.Router();

router.post("/", jwtParse, loyaltyController.createLoyaltyCard);
router.get("/", jwtParse, loyaltyController.getLoyaltyCardInfo);
router.put("/", jwtParse, loyaltyController.updateLoyaltyCardInfo);
router.delete("/", jwtParse, loyaltyController.deleteLoyaltyCard);

// export the router
export default router;
