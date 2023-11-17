const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 8080;

const path = require('path');

// ...

// Route to home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// Rota to Javascript page
app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
  });

app.get('/search', async (req, res) => {
  try {
    console.log('Received search request:', req.query); // request log.
    const keyword = req.query.keyword; //const to store the value of keyword.
    const asin = req.query.asin; //const to store the value of asin.

    if (!keyword || !asin) {
      return res.status(400).json({ error: 'Keyword and ASIN are required.' });
    }

    //setting pagination to a maximum of 5 pages
    const maxPages = 5;
    let position = -1;

    for (let page = 1; page <= maxPages; page++) {
      const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&page=${page}`;
      const response = await axios.get(url, {
        //headboard to make it difficult for Amazon to stop scraping
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        },
      });

      const $ = cheerio.load(response.data);

      const products = $('.s-result-item');

      // Check the product position with the ASIN provided.
      for (let i = 0; i < products.length; i++) {
        const asinElement = $(products[i]).data('asin');
        if (asinElement === asin) {
          position = (page - 1) * products.length + i + 1;
          break;
        }
      }

      if (position !== -1) {
        break;
      }
    }
    console.log('Position found:', position); // Log of the position found.
    res.json({ position });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
