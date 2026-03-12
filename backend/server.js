console.log("assets route loaded");
const express = require("express");
const cors = require("cors");

const assetRoutes = require("./routes/assets");

const riskRoutes = require("./routes/risks");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/assets", assetRoutes);

app.use("/api", riskRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});