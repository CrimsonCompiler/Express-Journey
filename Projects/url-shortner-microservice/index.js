require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

let magic = [];
const generateRandomNumber = () => Math.floor(Math.random() * 1000);

const validUrl = (req, res, next) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      error: "Url is required",
    });
  }

  let hostname;

  try {
    const parsed = new URL(url);
    hostname = parsed.hostname;
  } catch (err) {
    return res.status(400).json({ error: "Invalid url format" });
  }

  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({
        error: "invalid url",
      });
    } else {
      next();
    }
  });
};

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", validUrl, function (req, res) {
  const randNumber = generateRandomNumber();
  magic.push({ url: req.body.url, shortNum: randNumber });
  res.json({
    original_url: req.body.url,
    short_url: randNumber,
  });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  let shortUrlId = Number(req.params.short_url);
  for (let i = 0; i < magic.length; i++) {
    if (magic[i].shortNum === shortUrlId) {
      res.redirect(magic[i].url);
    }
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
