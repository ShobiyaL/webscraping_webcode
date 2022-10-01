const dotenv = require('dotenv').config()

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbName = "allProducts";
const dbUrl = process.env.DBURL;

module.exports={dbName,dbUrl,mongodb,MongoClient};