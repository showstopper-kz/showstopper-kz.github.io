hexo.extend.generator.register('articles-json', function(locals) {
    console.log('gen')
    var articles = locals.posts.map(function(post) {
      return {
        title: post.title,
        date: post.date.format('YYYY-MM-DD'),
        url: post.permalink
      };
    });
  
    return {
      path: 'api/articles',
      data: JSON.stringify(articles)
    };
  });
  