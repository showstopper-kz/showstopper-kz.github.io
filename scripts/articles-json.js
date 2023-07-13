const https = require('https');
const cheerio = require('cheerio')

const siteMap = {
  'arduino': 'www.arduino.cc',
  'github': 'https://github.com'
}

hexo.extend.generator.register('articles-json', function(locals) {
    console.log('gen')
    var articlesByYear = {};

    locals.posts.forEach(function(post) {
      var year = post.date.year();
      
      if (!articlesByYear[year]) {
        articlesByYear[year] = [];
      }
      
      articlesByYear[year].push({
        title: post.title,
        date: post.date.format('YYYY-MM-DD'),
        url: post.permalink
      });
    });
  
    var result = {};
    Object.keys(articlesByYear).forEach(function(year) {
      result[year] = articlesByYear[year];
    });
  
    return {
      path: 'api/articles',
      data: JSON.stringify(result)
    };
});
  

hexo.extend.generator.register('siteInfo-json', async function(locals) {
  console.log('gen url site info json')
  let siteInfo = {};

  console.log(Object.entries(siteMap))
  for (const [site, url] of Object.entries(siteMap)) {
    console.log('Key:', site);
    console.log('Value:', url);
    var isUrl = false;
    isUrl = url.startsWith('http') || url.startsWith('https');

    var result;
    if (isUrl) {
      result = await fetchData(url);
    } else {
      result = await fetchData('https://' + url);
    }

    siteInfo[site] = result;
  }

    return {
      path: 'api/siteInfo',
      data: JSON.stringify(siteInfo)
    };
/** 
  locals.posts.forEach(function(post) {
    var year = post.date.year();
    
    if (!articlesByYear[year]) {
      articlesByYear[year] = [];
    }
    
    articlesByYear[year].push({
      title: post.title,
      date: post.date.format('YYYY-MM-DD'),
      url: post.permalink
    });
  });

  var result = {};
  Object.keys(articlesByYear).forEach(function(year) {
    result[year] = articlesByYear[year];
  });

  return {
    path: 'api/articles',
    data: JSON.stringify(result)
  };
  */
});

async function fetchData(url) {
  return new Promise((resolve, reject) => {
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
        
        resolve({ title, iconHref, description });
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}
