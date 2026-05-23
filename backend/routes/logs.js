import express from 'express';

import{
    markComplete,
    unmarkComplete,
    getToday,
    getRange,
    getHeatMap,
    getHabitStats,
    getAllStats
} from '../controllers/logController.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.post("/", markComplete);
router.post("/", unmarkComplete);
router.get("/today", getToday);
router.get("/range", getRange);
router.get("/heatmap", getHeatMap);
router.get("/stats/:habitId", getHabitStats);
router.get("/stats", getAllStats);

export default router;