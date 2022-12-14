const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port=process.env.PORT || 5000;
var jwt = require('jsonwebtoken');
//midleware

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jpoqt1r.mongodb.net/?retryWrites=true&w=majority`;

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'Forbidden access'});
        }
        req.decoded = decoded;
        next();
    })
}



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
try{
 const serviceCollection=client.db('Wedding_Photography').collection("Services");
 const reviewCollection=client.db('Wedding_Photography').collection("Reviews");



 app.post('/jwt', (req, res) =>{
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d'})
    res.send({token})
})  


 app.get('/services',async(req,res)=>{
    const size=req.query.size;
    const page=parseInt(req.query.page);
    const item=parseInt(req.query.item);
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
        service =await cursor.skip(page*item).limit(item).toArray();
        
    }
    const count=await serviceCollection.estimatedDocumentCount();
    res.send({count,service});
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

app.post("/review",async(req,res)=>
{
    const service=req.body;
    const result=await reviewCollection.insertOne(service)
    res.send(result);
})

app.get('/reviews', async (req, res) => {
    
    let query = {};
            if (req.query.serviceid) {
                query = {
                    serviceid: req.query.serviceid
                }
            }
            const cursor = reviewCollection.find(query).sort({_id:-1});
            const reviews = await cursor.toArray();
            res.send(reviews);
});
app.get('/reviewsbyemail', verifyJWT, async (req, res) => {
    const decoded = req.decoded;
            
    if(decoded.email !== req.query.email){
        res.status(403).send({message: 'unauthorized access'})
    }
    let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query).sort({_id:-1});
            const reviews = await cursor.toArray();
            res.send(reviews);
});
app.patch('/reviwedit/:id', verifyJWT, async (req, res) => {
    const id = req.params.id;
    const review = req.body.review
    const query = { _id: ObjectId(id) }
    const updatedDoc = {
        $set:{
            review: review
        }
    }
    const result = await reviewCollection.updateOne(query, updatedDoc);
    res.send(result);
});
app.delete('/reviewedelete/:id', verifyJWT, async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await reviewCollection.deleteOne(query);
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