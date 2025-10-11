const express = require("express");
const cors = require("cors");
const payloadData = require("./payload.json");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/restaurants", async (req, res) => {
  console.log(req.body);
  const lat = req.body.latitude;
  const long = req.body.longitude;
  try {
    const dynamicPayload = JSON.parse(JSON.stringify(payloadData));

    dynamicPayload.variables.input.latitude = lat;
    dynamicPayload.variables.input.longitude = long;

    const response = await fetch("https://bd.fd-api.com/rlp-service/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        Origin: "https://www.foodpanda.com.bd",
        Referer: "https://www.foodpanda.com.bd/",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
      },
      body: JSON.stringify(dynamicPayload),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

app.listen(4000);
