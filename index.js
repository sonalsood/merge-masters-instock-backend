import express from "express";
import cors from "cors";
import "dotenv/config";
const app = new express();
const PORT = process.env.PORT || 5050;

app.use(cors());

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("merge-masters-instock-backend API HOMEPAGE");
});

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
