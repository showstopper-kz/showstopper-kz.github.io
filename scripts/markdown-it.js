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
      console.log("src: ==================== ", src)
      console.log("end =========================")
      const cap = /:::\s*show-site-info\s*(.*?)\s*:::\n/.exec(src);
      console.log("cap ===================== ", cap)
//      const res = await fetch('/public/api/siteInfo')
 //     console.log(res.json());

      if (cap !== null) {
        const site = cap[1].trim();
        cap[0] = "12345"

        return {
          type: 'show-site-info',
          raw: cap[0].trim(),
          text: cap[0].trim(),
          site: site,
        };
      }
    },
    renderer(token) {
      console.log("toekn=================")
      console.log(token)
      console.log("toekn=================")
      return '<a></a>';
  }
  })
})
