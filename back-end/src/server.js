import express from "express";
import { MongoClient } from "mongodb";


async function start() {
  const url = `mongodb+srv://fsd-vue:pword@cluster0.euzs9gm.mongodb.net/`;
  const client = new MongoClient(url);

  const app = express();
  app.use(express.json());

  await client.connect();
  const db = client.db("fsv-db");

  app.get("/products", async (req, res) => {
    const products = await db.collection("products").find({}).toArray();
    res.send(products);
  });

  async function populatedCartIds(ids) {
    return Promise.all(
      ids.map((id) => db.collection("products").findOne({ id }))
    );
  }

  app.get("/users/:userId/cart", async (req, res) => {
    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const populatedCart = await populatedCartIds(user.cartItems);
    res.json(populatedCart);
  });

  app.get("/products/:productId", async (req, res) => {
    const productId = req.params.productId;
    const product = await db.collection("products").findOne({ id: productId });
    res.json(product);
  });

  app.post("/users/:userId/cart", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

    await db.collection("users").updateOne( 
      { id: userId },
      {
        $addToSet: { cartItems: productId },
      }
    );

    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const populatedCart = await populatedCartIds(user.cartItems);
    res.json(populatedCart);
  });

  app.delete("/users/:userId/cart/:productId", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    await db.collection("users").updateOne(
      { id: userId },
      {
        $pull: { cartItems: productId },
      }
    );

    const user = await db
    .collection("users")
    .findOne({ id: userId });
  const populatedCart = await populatedCartIds(user.cartItems);
  res.json(populatedCart);
});

  app.listen(8000, () => {
    console.log("🚀 Server started on port 8000!");
  });
}

start();
