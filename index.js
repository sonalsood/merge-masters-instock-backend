import express from "express";
import cors from "cors";
import "dotenv/config";
const app = new express();
const PORT = process.env.PORT || 5050;

app.use(cors());

app.use(express.json());

import warehouseRoutes from "./routes/warehouse-routes.js";

app.get("/", (_req, res) => {
  res.send("merge-masters-instock-backend API HOMEPAGE");
});

app.use("/warehouses", warehouseRoutes);

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
