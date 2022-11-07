const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port=process.env.PORT || 5000;

//midleware

app.use(cors());
app.use(express.json());

//async await 
// async function run(){

// }
//user:
//pass:


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jpoqt1r.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
try{
 const serviceCollection=client.db('Wedding_Photography').collection("Services");
 app.get('/services',async(req,res)=>{
    const query={};
    const cursor=serviceCollection.find(query);
    const service =await cursor.toArray();
    res.send(service);
 })
}
finally
{

}
}
run();

app.get('/',(req,res)=>{
    res.send("new website ")
});
app.listen(port, () =>
{
    console.log(`Listening to port ${port}`);
})