const express = require("express");
var cors = require('cors')

const cheerio = require("cheerio");
const axios = require("axios");
module.exports = {
    async flipkartData(data){
        // console.log(data);
   try {
       const products = ['shelves','books','electronics'];
       
      for (const i of products) {
           console.log(i);

       const response = await axios.get('https://www.flipkart.com/search?q=pants&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off');
      
       const html = response.data;
    //    console.log(html);
       const $ = cheerio.load(html);

      

 $('div._13oc-S').each((_idx, el) => {
           const shelf = $(el)
        //    console.log(shelf);
           const title = shelf.find('div._2WkVRV').text();
        //    console.log(title,'=====');
           const image = shelf.find('img._2r_T1I').attr('src')



// const reviews = shelf.find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small').children('span').last().attr('aria-label')

const stars = shelf.find('div.a-section.a-spacing-none.a-spacing-top-micro > div > span').attr('aria-label')

const price = shelf.find('div._30jeq3').text()
const originalPrize = shelf.find('div._3I9_wc').text()
const offerpercent = shelf.find('div._3Ay6Sb > span').text()
const product = i;


    let element = {
        website:'flipkart',
        product,
        title,
        image,
        price,
        originalPrize,
        offerpercent
    }

   

    if (stars) {
        // console.log(stars);
        element.stars = stars
    }
// console.log(element);
           data.push(element)
       });
    } 
       return data;
   } catch (error) {
       throw error;
   }
}
}
