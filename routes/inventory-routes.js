import express from "express";
const router = express.Router();
import * as inventoryController from "../controllers/inventory-controller.js";

// GET /api/inventories
router.get("/", inventoryController.index);

// GET /api/inventories/:id
router.get("/:id", inventoryController.findOne);

export default router;
