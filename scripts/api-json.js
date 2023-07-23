const https = require('https');
const cheerio = require('cheerio')
const gameInfo = require('./gameInfo')

const siteMap = {
  'arduino': 'www.arduino.cc',
  'github': 'https://github.com'
}

hexo.extend.generator.register('articles-json', function(locals) {
    console.log('gen articles')
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

hexo.extend.generator.register('gameInfo-json',  function(locals) {
    console.log('gen gameInfo')
    return {
      path: 'api/gameInfo',
      data: gameInfo
    };
});
