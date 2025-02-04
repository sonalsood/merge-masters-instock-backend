import express from "express";
const router = express.Router();
import * as warehouseController from "../controllers/warehouse-controller.js";

// GET /api/warehouses
router.get("/", warehouseController.index);

// GET /warehouses/:id
router.route("/:id").get(warehouseController.findOne);

//GET warehouses/:id/inventories
router.route("/:id/inventories").get(warehouseController.inventory);
export default router;
