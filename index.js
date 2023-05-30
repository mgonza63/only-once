const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");

const dotenv = require("dotenv");
dotenv.config();

const { ObjectId } = require("mongodb");

const PORT = process.env.PORT;

const MongoClient = require("mongodb").MongoClient;
const MONGO_URI = `mongodb+srv://mgonza63:${process.env.MONGO_PASS}@cluster0.nf9vkkq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(MONGO_URI);

const database = client.db("test");
const collection = database.collection("messages");

app.set("view engine", "ejs");
app.use(express.static("public"));

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 3 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/", limiter, async (req, res) => {
  try {
    const message = await collection.insertOne({text: req.body.text})
    console.log("POST", message);
    res.status(200).json(message.insertedId);
  } catch (error) {
    console.error(error)
  }
});
app.get("/:id", async (req, res) => {
  try {
    const message = await collection.findOne(new ObjectId(req.params.id));
    if (message !== null) {
      console.log(message);
      res.render("message");
    } else {
      console.log("message deleted");
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
app.get("/message/:id", async (req, res) => {
  try {
    console.log("USER ACCESSED MESSAGE:", req.params.id);
    const query = {
      _id: new ObjectId(req.params.id)
   };
    let message = await collection.findOne(query);

    if (message !== null) {
      res.status(200).json(message);
      message = await collection.deleteOne(query)
      if (message.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
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

async function run() {
  try {
    const database = client.db("test");
    const collection = database.collection("messages");

    const query = { text: "Gooseless" };

    const foundMessage = await collection.findOne(new ObjectId('64759f63f3c3a36bc255d52e'));

    console.log("found message:", foundMessage);
  } catch (error) {
    console.error(error);
  }
}
// run();
