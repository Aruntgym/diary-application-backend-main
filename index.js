const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const app = express();
const dotenv = require("dotenv").config();
const URL = process.env.DB;



app.use(express.json());
app.use(cors())
console.log(URL);

// Read-get inc/exp data
app.get("/all", async (req, res) => {
  try {
    //Connect the DB
    const connection = await mongoclient.connect(URL);

    //Select the DB
    const db = await connection.db("memodb");

    //Select collection
    //Do operation(CRUD)
    const product = await db.collection("memory").find(req.query).toArray();

    //Close connection
    await connection.close();

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get('/all/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Connect the DB
    const connection = await mongoclient.connect(URL);

    // Select the DB
    const db = await connection.db('memodb');

    // Select collection and find by ID
    const product = await db.collection('memory').findOne({ _id: new ObjectId(id) });

    // Close connection
    await connection.close();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});



app.put("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    // Connect the DB
    const connection = await mongoclient.connect(URL);

    // Select the DB
    const db = await connection.db("memodb");

    // Select collection and do operation (CRUD)
    const result = await db.collection("memory").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    // Close connection
    await connection.close();

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json({ message: "Business updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Connect the DB
    const connection = await mongoclient.connect(URL);

    // Select the DB
    const db = await connection.db("memodb");

    // Select collection and do operation (CRUD)
    const result = await db.collection("memory").deleteOne({ _id: new ObjectId(id) });

    // Close connection
    await connection.close();

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json({ message: "Business deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});



app.listen(process.env.PORT || 3002);
