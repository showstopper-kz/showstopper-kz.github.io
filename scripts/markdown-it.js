hexo.extend.filter.register('marked:renderer', function(renderer) {
  const { config } = this; // Skip this line if you don't need user config from _config.yml
  renderer.image 
  renderer.image = (href, title, text) => {
    return `<img src=${href} ></img><div style="text-align: center;"><p>${text}</p></div>`;
  }
})