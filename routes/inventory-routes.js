import express from "express";
const router = express.Router();
import * as inventoryController from "../controllers/inventory-controller.js";

router
  .route("/")
  .get(inventoryController.getInventories)
  .post(inventoryController.addInventory);

router
  .route("/:id")
  .get(inventoryController.findInventory)
  .put(inventoryController.editInventory)
  .delete(inventoryController.deleteInventory);

export default router;
