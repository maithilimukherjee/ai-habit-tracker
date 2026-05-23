import express from "express";

import {
    weeklyReport,
    suggestIdeas,
    recoveryPlan,
    chatAnalysis,
    morningMotivation
} from "../controllers/aiController.js";

import {protect} from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/weekly-report", weeklyReport);
router.post("/suggest-ideas", suggestIdeas);
router.post("/recovery-plan",recoveryPlan);
router.post("/chat",chatAnalysis);
router.post("/morning",morningMotivation);

export default router;

