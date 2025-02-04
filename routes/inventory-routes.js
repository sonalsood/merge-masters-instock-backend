import express from "express";
const router = express.Router();
import * as inventoryController from "../controllers/inventory-controller.js";

// GET /api/warehouses
router.get("/", inventoryController.index);

export default router;
