const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

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
             const size = $(".list").eq(0).find("li:nth-child(4) span").text();
             const seeders = $(".list").eq(1).find("li:nth-child(4) span").text();
             const leechers = $(".list").eq(1).find("li:nth-child(5) span").text();
             
              const magnetObj =  {
                magnet,
                name,
                size,
                seeders,
                leechers
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
})

app.post('/search', async (req, res) => {
  const query = req.body.query || 'venom'
  const encodedQuery = encodeURI(query)
  const url = `https://www.1377x.to/search/${encodedQuery}/1/`
  
 const response = await getFromSearch(url)
 res.json(response)
})

app.listen(3000, () => {
  console.log("We Are live on 3000");
});