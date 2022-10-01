const express = require("express");
var cors = require('cors')
const PORT = 4001;
const cheerio = require("cheerio");
const axios = require("axios");
const { flipkartData} = require('./flipkart');
const { snapdealData} = require('./snapdeal');
const { dbName, dbUrl, mongodb, MongoClient } = require("./dbconfig");
const app = express();

//Middlewaare
app.use(express.json());
app.use(cors({
  origin:"http://localhost:3000"
})) 

// connecting with database
const client = new MongoClient(dbUrl);

const fetchData = async () => {
  try {
    const products =["shoes"];
    // const products = ["shelves", "shirts", "shoes", "electronics", "toys","mobiles","books"];
    const allProducts = [];
    for (const i of products) {
      console.log(i);
      const response = await axios.get(
        "https://www.amazon.com/s?crid=36QNR0DBY6M7J&k=" +
          i +
          "&ref=glow_cls&refresh=1&sprefix=s%2Caps%2C309"
      );
      const html = response.data;
      //    console.log(html);
      const $ = cheerio.load(html);

      $(
        "div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20"
      ).each((_idx, el) => {
        const shelf = $(el);
        //    console.log(shelf);
        const title = shelf
          .find(
            "div.a-section.a-spacing-none.a-spacing-top-small > h2 > a > span"
          )
          .text();
        //    console.log(title,'=====');
        const image = shelf.find("img.s-image").attr("src");
        const ratings = shelf
          .find("div.a-section.a-spacing-none.a-spacing-top-micro > div > span")
          .attr("aria-label");
        const price = shelf.find("span.a-price > span.a-offscreen").text();
        const finalPrice = shelf
          .find(
            "div.a-section.a-spacing-none.a-spacing-top-mini > div > span.a-color-base"
          )
          .text();
        const product = i;

        let element = {
          website:"Amazon",
          product,
          title,
          image,
          price,
          finalPrice,
        };
        if (ratings) {
          // console.log(stars);
          element.ratings = ratings;
        }
        // console.log(element);
        allProducts.push(element);
      });
    }

    return allProducts;
  } catch (error) {
    throw error;
  }
};
fetchData()
  .then((data) => run(data).catch(console.dir))
  .catch((error) => console.log(error));

async function run(data) {
  try {
    const database = client.db(dbName);
    const gthy = database.collection("products");
    // Query
    // console.log(data.length,"rfvtgvfkhyxvvcdctwfe");
let flipinfo = await flipkartData(data);
// console.log(info);
let totalInfo = await snapdealData(flipinfo);
// console.log(totalInfo);
    const prods = await gthy.insertMany(totalInfo);
    console.log(prods);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
app.get('/getProduct', async function(req,res){
    // console.log(req);
    await client.connect();
    try{
    const db = await client.db(dbName);
    const query ={'product':req.query.product};
    // console.log(query);
    let products = await db.collection('products').find(query).toArray();
    // console.log(products);
    res.json({
        statusCode:200,
        products
    })
}catch(error){
    console.log(error)
    res.json({
        statusCode:500,
        message:"Internal Server Error",
        error
    })
}finally{
    client.close();
}
})


app.listen(process.env.PORT||PORT, () => console.log(`Server running on PORT--${PORT}`));
