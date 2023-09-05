import express from "express";
import { MongoClient } from "mongodb";
import path from "path";

async function start() {
  const url = `mongodb+srv://fsd-vue:pword@cluster0.euzs9gm.mongodb.net/`;
  const client = new MongoClient(url);

  const app = express();
  app.use(express.json());

  await client.connect();
  const db = client.db("fsv-db");

  app.use("/images", express.static(path.join(__dirname, "../assets")));

  app.get("/api/products", async (req, res) => {
    const products = await db.collection("products").find({}).toArray();
    res.send(products);
  });

  async function populatedCartIds(ids) {
    return Promise.all(
      ids.map((id) => db.collection("products").findOne({ id }))
    );
  }

  app.get("/api/users/:userId/cart", async (req, res) => {
    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const populatedCart = await populatedCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.get("/api/products/:productId", async (req, res) => {
    const productId = req.params.productId;
    const product = await db.collection("products").findOne({ id: productId });
    res.json(product);
  });

  app.post("/api/users/:userId/cart", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

    const existingUser = await db.collection("users").findOne({ id: userId });
    if (!existingUser) {
      await db.collection("users").insertOne({
        id: userId,
        cartItems: [],
      });
    }

    await db.collection("users").updateOne(
      { id: userId },
      {
        $addToSet: { cartItems: productId },
      }
    );

    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const populatedCart = await populatedCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.delete("/api/users/:userId/cart/:productId", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    await db.collection("users").updateOne(
      { id: userId },
      {
        $pull: { cartItems: productId },
      }
    );

    const user = await db.collection("users").findOne({ id: userId });
    const populatedCart = await populatedCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.listen(8000, () => {
    console.log("🚀 Server started on port 8000!");
  });
}

start();
