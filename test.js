const { marked } = require("marked");

const siteInfo = {
      name: 'show-site-info',
      level: 'block',
    tokenizer(src, tokens) {
      console.log("src: ==================== ", src)
      console.log("end =========================")
      const cap = /^:::\s*show-site-info\s*(.*?)\s*:::/.exec(src);
      console.log("cap ===================== ", cap)
//      const res = await fetch('/public/api/siteInfo')
 //     console.log(res.json());

      if (cap !== null) {
        const site = cap[1].trim();

        return {
          type: 'show-site-info',
          raw: cap[0],
          text: cap[0],
          site: site,
          tokens: []  
        };
      }

      return undefined;
    },
    renderer(token) {

      return '<a></a>';
  }
}

marked.use({extensions: [siteInfo]})
async function test() {
  const str = '\ntest\n'+ '::: show-site-info\nurl\n:::\ntest\n';
  let tokens =marked.lexer(str) 
  console.log(tokens)
  console.log(marked.parser(tokens))
}

test()
