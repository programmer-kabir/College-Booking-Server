const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// Middle ware
app.use(cors());
app.use(express.json());


// console.log(process.env.DB_USER);

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0i3pjbq.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    const collegeCollection = client.db("End-Game").collection("college-data");
    const selectedCollection = client.db("End-Game").collection("my-college");
    const reviewCollection = client.db("End-Game").collection("review");
    const usersCollection = client.db("End-Game").collection("users");



    app.post('/users', async(req, res) =>{
      const user = req.body;
      console.log(user);
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exist" });
      }
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    app.get('/college', async(req, res) =>{
      const result = await collegeCollection.find().toArray()
      res.send(result)
    })


    // My selected college
    app.post('/my-college', async(req, res) =>{
      const body = req.body
      const result = await selectedCollection.insertOne(body)
      res.send(result)
    })

    app.get('/my-college', async(req, res) =>{
      const email = req.query.email
      console.log(email);
      if(!email){
        return []
      }
      const filter = {email:email}
      const result = await selectedCollection.find(filter).toArray()
      res.send(result)
    })

    app.post('/review', async(req, res) =>{
      const body = req.body
      console.log(body);
      const result  = await reviewCollection.insertOne(body)
      res.send(result)
    })

    app.get('/review', async(req, res) =>{
      const body = req.body;
      const result = await reviewCollection.find().toArray()
      res.send(result)
    })

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

app.get("/", (req, res) => {
  res.send("Sever is running");
});
app.listen(port);