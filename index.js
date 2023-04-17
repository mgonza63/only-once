const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const Message = require("./model/message");

const PORT = process.env.PORT;
const MONGO_URI = `mongodb+srv://mgonza63:${process.env.MONGO_PASS}@cluster0.nf9vkkq.mongodb.net/?retryWrites=true&w=majority`;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(MONGO_URI);

app.get("/", (req, res) => {
  res.render("home");
});
app.post("/", async (req, res) => {
//   console.log(req.body.text);
  const message = new Message({ text: req.body.text });
  await message.save()
  console.log(message);
});
app.get("/:id", async (req, res) => {
    // myObjectIdString = myObjectId.toString()
    // const message = await Message.findOne({ uuid: req.body.id })
    const message = await Message.findById(req.params.id).exec()
    console.log(message)
    res.send(message)
});

app.listen(PORT, () => {
  console.log(`app listening in http://localhost:${PORT}`);
});
