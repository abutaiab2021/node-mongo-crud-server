const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = 5000;

//middle ware
app.use(cors());
app.use(express.json());

//mongo db user name & password info
//user name = mydbuser1
//password = wcywi7HBRBwuGB7u
//ip address = 0.0.0.0/0


// for connection database
const uri = "mongodb+srv://mydbuser1:wcywi7HBRBwuGB7u@cluster0.xuva5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//First system

// client.connect(err => {
//   const collection = client.db("foodMaster").collection("users");
//   // perform actions on the collection object
//   console.log('hitting the database');
//   const user = {name : 'Omar Faruk',email: 'Omar@gmail.com',phone : '01666699999'};
//   collection.insertOne(user)
//   .then( () =>{
//       console.log("Data insert successfully");
//   })

// //   console.error(err);
// //   client.close();
// });

//end


//another system
async function run() {
    try {
      await client.connect();
      const database = client.db("foodMaster");
      const usersCollection = database.collection("users");
      
      //GET API
      app.get('/users', async(req,res) =>{
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users)
      });

      app.get('/users/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id : ObjectId(id)};
        const user = await usersCollection.findOne(query);
        console.log('Load user with id',id);
        res.send(user);
      })

      // POST API
      app.post('/users', async(req,res) => {
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        // console.log('Got New User post',req.body);
        // console.log('added user',result);
        res.json(result);
      });


      //UPDATE API
      app.put('/users/:id',async(req,res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = {_id : ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            name : updatedUser.name,
            email : updatedUser.email
          },
        };
        const result = await usersCollection.updateOne(filter,updateDoc,options)
        console.log('updated user',req);
        res.json(result)
      });


      //DELETE API
      app.delete('/users/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id : ObjectId(id)};
        const result = await usersCollection.deleteOne(query);
        console.log('deleting user with id',result);
        res.json(result);
      })


    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);

  //end

app.get('/',(req,res)=>{
    res.send('running my CRUD Server');
});

app.listen(port, ()=>{
    console.log('running server on port',port);
})