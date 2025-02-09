import express from "express";
import cors from "cors";
import "dotenv/config";
import warehousesRoute from "./routes/warehouse-routes.js";
import inventoryRoute from "./routes/inventory-routes.js";
const app = express();
const PORT = process.env.PORT || 5050;
app.use(express.json());
app.use(cors());

app.use("/api/warehouses", warehousesRoute);
app.use("/api/inventories", inventoryRoute);

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
