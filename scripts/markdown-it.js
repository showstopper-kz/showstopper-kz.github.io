const siteInfo = require('./siteInfo')
console.log(siteInfo)

hexo.extend.filter.register('marked:renderer', function(renderer) {
  const { config } = this; // Skip this line if you don't need user config from _config.yml
  renderer.image = (href, title, text) => {
    return `<img src=${href} ></img><div style="text-align: center;"><p>${text}</p></div>`;
  }
})

hexo.extend.filter.register('marked:extensions', async function(extensions) {
  extensions.push({
    name: 'show-site-info',
    level: 'block',
    tokenizer(src, tokens) {
      const cap = /^:::\s*show-site-info\s*(.*?)\s*:::/.exec(src);

      if (cap !== null) {
        const site = cap[1].trim();
        return {
          type: 'show-site-info',
          raw: cap[0],
          text: cap[0].trim(),
          siteInfo: siteInfo[site],
          site:site,
        };
      }
    },
    renderer(token) {
      let siteInfo = token.siteInfo;
      let site = token.site;

      let title = siteInfo.title;
      let url = siteInfo.url;
      let fqdn = siteInfo.fqdn;
      let iconHref = siteInfo.iconHref;
      let description = siteInfo.description;
      console.log(siteInfo)
      return `
      <div class="site-info-box">
        <div class="left-column">
          <a href=${url} class="title">${title}</a>
          <div class="description">${description}</div>
          <div class="fqdn">${fqdn}</div>
        </div>
        <div class="right-column">
          <img class="site-info-img" src="${iconHref}" alt="网页图标">
        </div>
      </div>
    `;
  }
  })
})
