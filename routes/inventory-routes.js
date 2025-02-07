import express from "express";
const router = express.Router();
import * as inventoryController from "../controllers/inventory-controller.js";

// GET /api/inventories // POST /api/inventories
router
  .route("/")
  .get(inventoryController.index)
  .post(inventoryController.addInventory);

// GET /inventories/:id  PUT /inventories/:id DELETE /inventories/:id
router
  .route("/:id")
  .get(inventoryController.findOne)
  .put(inventoryController.editInventory)
  .delete(inventoryController.deleteInventory);

export default router;
