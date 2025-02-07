import express from "express";
const router = express.Router();
import * as inventoryController from "../controllers/inventory-controller.js";

// GET /api/inventories
router.get("/", inventoryController.index);

// GET /api/inventories/:id
router.get("/:id", inventoryController.findOne);

// POST /api/inventories
router.post("/", inventoryController.addInventory);

// GET /inventories/:id  PUT /inventories/:id
router
  .route("/:id")
  .get(inventoryController.findOne)
  .put(inventoryController.editInventory);

export default router;
