const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port=process.env.PORT || 5000;

//midleware

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jpoqt1r.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
try{
 const serviceCollection=client.db('Wedding_Photography').collection("Services");
 app.get('/services',async(req,res)=>{
    const size=req.query.size;
    const query={};
    
    let service
    if(size==3)
    {
        const cursor=serviceCollection.find(query).sort({_id:-1});
        service =await cursor.limit(3).toArray();
        
    }
    else
    {
        const cursor=serviceCollection.find(query).sort({_id:-1});
        service =await cursor.toArray();
    }
    
    res.send(service);
 });
 app.get('/services/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const service = await serviceCollection.findOne(query);
    res.send(service);
});
app.post("/services",async(req,res)=>
{
    const service=req.body;
    const result=await serviceCollection.insertOne(service)
    res.send(result);
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