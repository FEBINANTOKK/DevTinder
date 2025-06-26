const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("Hello hello3333ww");
});
app.listen("7777", () => {
  console.log("server sucessfully listerning");
});
