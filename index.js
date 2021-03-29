const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgpqy.mongodb.net/EmaJohnStore?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());


const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("EmaJohnStore").collection("products");
    const orderCollection = client.db("EmaJohnStore").collection("orders");
    
    app.post('/addProducts', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount)

            })
    })
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })
    app.post('/productByKeys',(req,res) =>{
        const productKeys = req.body;
        productsCollection.find({key:{$in: productKeys}})
        .toArray((err,documents) =>{
            res.send(documents)
        })
    })
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)

            })
    })

});
app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port)