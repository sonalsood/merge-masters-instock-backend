import express from "express";
const router = express.Router();
import * as warehouseController from "../controllers/warehouse-controller.js";

// GET /api/warehouses
router.get("/", warehouseController.index);

export default router;
