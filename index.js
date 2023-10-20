const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("root route of server");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://brandshop:2b0eMW6MQnxUEAvE@cluster0.wgk6h9w.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const productCollection = client.db("productDB").collection("products");
    const brandCollection = client.db("productDB").collection("brands");
    const userCollection = client.db("productDB").collection("users");

    //get all brands
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //get specific brands
    app.get("/brands/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brandName: brandName };
      const cursor = brandCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get all product from database
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get all users
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get specific user
    app.get("/users/:email", async (req, res) => {
      const paramEmail = req.params.email;
      const query = { email: paramEmail };
      const cursor = userCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get all products
    app.get("/allproducts", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get data according to brand name
    app.get("/products/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brandName: brandName };
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //get specific product
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // add a product to database
    app.post("/addproduct", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    // update product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateInfo = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateData = {
        $set: {
          photo: updateInfo.photo,
          name: updateInfo.name,
          brandName: updateInfo.brandName,
          type: updateInfo.type,
          price: updateInfo.price,
          rating: updateInfo.rating,
        },
      };
      const result = await productCollection.updateOne(filter, updateData);
      res.send(result);
    });

    // update user with cart product
    app.put("/cart/:email", async (req, res) => {
      const activeUserEmail = req.params.email;
      const data = req.body;
      const filter = { email: activeUserEmail };
      const option = { upsert: true };
      const updateData = {
        $push: {
          productId: data.productIds,
        },
      };
      const result = await userCollection.updateOne(filter, updateData, option);
      res.send(result);
    });

    // update user cart product by deleting item
    app.put("/cart/delete/:email", async (req, res) => {
      const activeUserEmail = req.params.email;
      const data = req.body;
      console.log(data);
      const filter = { email: activeUserEmail };
      const option = { multi: false };
      const updateData = {
        $pull: {
          productId: data.productIds,
        },
      };
      const result = await userCollection.updateOne(filter, updateData, option);
      res.send(result);
    });

    // add user
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
      console.log(result);
    });
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running port port: ${port}`);
});
