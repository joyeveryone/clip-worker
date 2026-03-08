const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Clip worker running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
