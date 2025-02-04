import express from "express";
import cors from "cors";
import "dotenv/config";
import warehousesRoute from "./routes/warehouse-routes.js";
const app = express();
const PORT = process.env.PORT || 5050;

app.use("/api/warehouses", warehousesRoute);
app.use(cors());

app.use(express.json());

import warehouseRoutes from "./routes/warehouse-routes.js";

app.get("/", (_req, res) => {
  res.send("merge-masters-instock-backend API HOMEPAGE");
});

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
