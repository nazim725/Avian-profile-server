const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const cors = require('cors')

// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9s2cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try{
        await client.connect();
        const database = client.db("Avian-Profile");
        const userCollection = database.collection("users");
        const hiredUsersCollection = database.collection("hiredUsers");

        // save user to database/ this function is used for register form
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
        // save user to database/ this function is used for register form
        app.post('/hiredUsers', async (req, res) => {
            const user = req.body;
            const result = await hiredUsersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

         // update user to database/ this function is used for google signing
         app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

         // get all Profile 
         app.get('/hiredUsers', async (req, res) => {
            const cursor = hiredUsersCollection.find({});
            const profile = await cursor.toArray();
            res.send(profile);
        });

        // get a single profile frpm hiredUsers collection
        app.get('/hiredUsers/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const profile = await hiredUsersCollection.findOne(query);
            res.json(profile);
        });

        // update data into products collection
        app.put('/hiredUsers/:id', async (req, res) => {
            const id = req.params.id;
            console.log('updating', id)
            const updatedProfile = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedProfile.name,
                    email: updatedProfile.email,
                    img: updatedProfile.img,
                    phone: updatedProfile.phone,
                    city: updatedProfile.city
                    


                },
            };
            const result = await hiredUsersCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)


        });


    }
    finally{
        // await client.close()
    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Avian Server is Running")
})

app.listen(port, () => {
    console.log("Running Avian Port:", port)
})