const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/restaurants", async (req, res) => {
  try {
    const payload = req.body;

    const response = await fetch("https://bd.fd-api.com/rlp-service/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        Origin: "https://www.foodpanda.com.bd",
        Referer: "https://www.foodpanda.com.bd/",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

app.listen(4000);
