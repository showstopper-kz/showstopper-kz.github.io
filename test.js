
const https = require('https');
const url = 'https://www.arduino.cc'; // 替换为你的 URL
const cheerio = require('cheerio')

    https.get(url, (response) => {
        let html = '';
      
        response.on('data', (chunk) => {
          html += chunk;
        });
      
        response.on('end', () => {
        const $ = cheerio.load(html);
        const title = $('title').text();
const iconHref = $('link[rel="icon"]').attr('href');
const description = $('meta[name="description"]').attr('content');
console.log(title)
console.log(iconHref)
console.log(description)
        });
      }).on('error', (error) => {
        console.error(error);
      });