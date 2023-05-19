const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());

//mongo db

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bg5p3bd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // all 
        const toyCollection = client.db('toyHeroDb').collection('toys');

        // all toy data loaded 
        app.get('/toys', async (req, res) => {
            const cursor = toyCollection.find().skip(0).limit(20);
            const result = await cursor.toArray();
            res.send(result);
        })
        // get single data 
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            // get all data using query id
            const query = { _id: new ObjectId(id) };

            // get some or all data using option
            const options = {
                //set condition which data we are get
                // value:0 means ---not get dada
                // value:1 means ---get data data
                // id by default get
                projection: {
                    toyName: 1,
                    toyPhoto: 1,
                    sellerName: 1,
                    email: 1,
                    rating: 1,
                    quantity: 1,
                    price: 1,
                    description: 1,
                },
            };
            const result = await toyCollection.findOne(query, options);
            res.send(result);
        })
        // get some data using query
        app.get('/toy/email', async (req, res) => {
            // const el = req.query.email;
            
            // console.log('Email----', el);
            // const result = await toyCollection.find({email:el}).toArray();
            // res.send(result);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await toyCollection.find(query).toArray();
            res.send(result);
        })
        // add toy data
        app.post('/add-toy', async (req, res) => {
            const toy = req.body;
            console.log(toy);
            const result=await toyCollection.insertOne(toy);
            res.send(result);
        })
        // delete toy single data
        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        })
        // get update single data
        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            // get all data using query id
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.find(query);
            res.send(result);
        })

        // set update single data
        app.put('/updateToy/:id', async (req, res) => {
            const id = req.params.id;
            const updatedToy = req.body;
            console.log(updatedToy);
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updateInfo = {
                $set: {
                    sellerName:updatedToy.sellerName,
                    email: updatedToy.email,
                    toyName:updatedToy.toyName,
                    toyPhoto:updatedToy.toyPhoto,
                    subcategory:updatedToy.subcategory,
                    price:updatedToy.price,
                    quantity:updatedToy.quantity,
                    rating:updatedToy.rating,
                    description:updatedToy.description,
                }
            }
            const result = await toyCollection.updateOne(filter, updateInfo, option);
            res.send(result);

        })
        //
        // app.get('/toys', async (req, res) => {
        //     const cursor = toyCollection.find().skip(0).limit(20);
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })
        // get all data 
        app.get('/allToyData', async (req, res) => {
            const result = await toyCollection.find().toArray();
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Assignment 10 is running');
})
app.listen(port, () => {
    console.log(`Assignment 10 is running on port: ${port}`)
})
