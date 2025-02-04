import express from "express";
const router = express.Router();
import * as warehouseController from "../controllers/warehouse-controller.js";

router.route("/:id").get(warehouseController.findOne);

export default router;
