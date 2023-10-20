const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s64u1mi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const wishCollection = client.db("wishDB").collection("wish");
    const brandCollection = client.db("wishDB").collection("Brand");


    app.get("/products", async (req, res) => {
      const cursor = wishCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await wishCollection.findOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const saikat = req.body;
      console.log(saikat);
      const result = await wishCollection.insertOne(saikat);
      res.send(result);
    });


    // brand

    app.get("/cart", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.findOne(query);
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const tawhid = req.body;
      console.log(tawhid);
      const result = await brandCollection.insertOne(tawhid);
      res.send(result);
    });

    app.put("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const updatedProducts = {
        $set: {
          name: updateProduct.name,
          type: updateProduct.type,
          price: updateProduct.price,
          rating: updateProduct.rating,
          brand: updateProduct.brand,
          Description: updateProduct.Description,
          photo: updateProduct.photo,
        },
      };
      const result = await brandCollection.updateOne(
        query,
        updatedProducts,
        options
      );
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.deleteOne(query);
      res.send(result);
    });



    app.get("/", (req, res) => {
      res.send("assingment-10");
    });
    app.listen(port, () => {
      console.log(`server:${port}`);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
