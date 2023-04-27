const express = require("express");
const app = express();
const rateLimit = require('express-rate-limit')

const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const Message = require("./model/message");

const PORT = process.env.PORT;
const MONGO_URI = `mongodb+srv://mgonza63:${process.env.MONGO_PASS}@cluster0.nf9vkkq.mongodb.net/?retryWrites=true&w=majority`;

app.set("view engine", "ejs");
app.use(express.static("public"));

const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 3 minutes
	max: 10, // Limit each IP to 10 requests per `window` (here, per 3 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));

mongoose.connect(MONGO_URI);

app.get("/", (req, res) => {
  res.render("home");
});

// Apply the rate limiting middleware to post requests
app.use(limiter)

app.post("/", async (req, res) => {
  const message = new Message({ text: req.body.text });
  await message.save();
  console.log(message);
  res.status(200).json(message._id);
});
app.get("/:id", async (req, res) => {
  const message = await Message.findById(req.params.id).exec();

  try {
    if (message !== null) {
      res.render("message");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
app.get("/message/:id", async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id).exec();

    if (message !== null) {
      res.status(200).json(message);
      console.log('object deleted:', message);
    } else {
      res.status(400).json({ text: "The message has been deleted" });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
app.listen(PORT, () => {
  console.log(`app listening in http://localhost:${PORT}`);
});
