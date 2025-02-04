import express from "express";
const router = express.Router();
import * as warehouseController from "../controllers/warehouse-controller.js";

// GET /api/warehouses
router.get("/", warehouseController.index);

// GET /warehouses/:id
router.route("/:id").get(warehouseController.findOne);

export default router;
