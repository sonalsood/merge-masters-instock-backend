import express from "express";
const router = express.Router();
import * as warehouseController from "../controllers/warehouse-controller.js";

// GET /api/warehouses
router.get("/", warehouseController.index);

//POST /api/warehouses
router.post("/", warehouseController.addWarehouse);

// GET AND DELETE /warehouses/:id
router.route("/:id").get(warehouseController.findOne).delete(warehouseController.deleteWarehouse);
// GET /warehouses/:id  PUT /warehouses/:id
router
  .route("/:id")
  .get(warehouseController.findOne)
  .put(warehouseController.editWarehouse);

//GET warehouses/:id/inventories
router.route("/:id/inventories").get(warehouseController.inventory);

export default router;
