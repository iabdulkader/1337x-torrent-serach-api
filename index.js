const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.js');

const app = express();


// Middlewares
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

async function getFromSearch(url){
      const urls =[];
      const response = await axios.get(url)
      const html = response.data;
      const $ = cheerio.load(html);
      $('.name', html).each(function() {
        const url = $(this).find('a:last-child').attr('href');
      if (url != undefined) {
        urls.push(`https://www.1377x.to${url}`);
      }
      })
      return await getMagnets(urls)
}

async function getMagnets(urls){
      var magnets = [];
      for(let x of urls){
        const magnetLinks = await fetchMagnets(x);
        magnets.push(magnetLinks)
      }
        return magnets
    }
   
   const fetchMagnets = async (url) => {
    try {
        const resp = await axios.get(url);
        const html = resp.data;
            const $ = cheerio.load(html);
             
            const magnet = $('.dropdown-menu', html).find('li:nth-child(4) a').attr('href')
            const name = $(".box-info-heading").text().trim();
             const size = $(".list").eq(1).find("li:nth-child(4) span").text();
             const downloads = $(".list").eq(2).find("li:nth-child(1) span").text();
             const seeders = $(".list").eq(2).find("li:nth-child(4) span").text();
             const leechers = $(".list").eq(2).find("li:nth-child(5) span").text();
             const imgUrl = $(".torrent-image").find("img").attr("src");
             if(imgUrl != undefined){
               img = `https://www.1377x.to${imgUrl}`
             } else {
               img = false
             }
             
              const magnetObj =  {
                magnet,
                name,
                size,
                downloads,
                seeders,
                leechers,
                img
              }
             // console.log(magnetObj)
              return magnetObj
    } catch (err) {
        // Handle Error Here
       console.error(err);
       
    }
};

app.get("/", (req, res) => {
  res.json({
    status: true,
    server: "running"
  })
});

// Swagger Ui configuration 
var options = {
  customCssUrl: '/public/docs/swagger-ui.css'
};
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/search', async (req, res) => {
  const query = req.body.query || 'venom';
  const page = req.body.page || 1;
  const encodedQuery = encodeURI(query)
  const url = `https://www.1377x.to/search/${encodedQuery}/${page}/`
  console.log(url)
 const response = await getFromSearch(url)
 res.json(response)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("We Are live on 3000");
});
