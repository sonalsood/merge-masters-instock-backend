import express from "express";
const router = express.Router();
import * as warehouseController from "../controllers/warehouse-controller.js";

router
  .route("/")
  .get(warehouseController.getWarehouses)
  .post("/", warehouseController.addWarehouse);

router
  .route("/:id")
  .get(warehouseController.findWarehouse)
  .put(warehouseController.editWarehouse)
  .delete(warehouseController.deleteWarehouse);

router
  .route("/:id/inventories")
  .get(warehouseController.getWarehouseinventories);

export default router;
