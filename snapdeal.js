const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
    async snapdealData(flipinfo){
   try {

       const products = ['shelves','shoes','books'];
       
      for (const i of products) {
           console.log(i);

           const response = await axios.get('https://www.snapdeal.com/search?keyword='+i+'&santizedKeyword=tshirt&catId=0&categoryId=0&suggested=true&vertical=p&noOfResults=20&searchState=&clickSrc=suggested&lastKeyword=&prodCatId=&changeBackToAll=true&foundInAll=false&categoryIdSearched=&cityPageUrl=&categoryUrl=&url=&utmContent=&dealDetail=&sort=rlvncy');
      
       const html = response.data;
    //    console.log(html);
       const $ = cheerio.load(html);

      

 $('div.col-xs-6.favDp.product-tuple-listing.js-tuple').each((_idx, el) => {
           const shelf = $(el)
        //    console.log(shelf);
           const title = shelf.find('p.product-title').text();
        //    console.log(title,'=====');
           const image = shelf.find('picture.picture-elem > source').attr('srcset')

const link = shelf.find('a.a-link-normal.a-text-normal').attr('href')

const reviews = shelf.find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small').children('span').last().attr('aria-label')

const stars = shelf.find('div.a-section.a-spacing-none.a-spacing-top-micro > div > span').attr('aria-label')

const price = shelf.find('div.product-price-row.clearfix > div.lfloat.marR10 > span.lfloat.product-price').text()
const originalPrize = shelf.find('div.product-price-row.clearfix > div.lfloat.marR10 > span.lfloat.product-desc-price.strike ').text()
const offerpercent = shelf.find('div.product-price-row > div.product-discount > span').text()
const product = i;


    let element = {
        website:"snapdeal",
        product,
        title,
        image,
        link: `https://amazon.com${link}`,
        price,
        originalPrize,
        offerpercent
    }

    if (reviews) {
        // console.log(reviews);
        element.reviews = reviews
    }

    if (stars) {
        // console.log(stars);
        element.stars = stars
    }
// console.log(element);
           flipinfo.push(element)
       });
    } 

       return flipinfo;
   } catch (error) {
       throw error;
   }
}
}